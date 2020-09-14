import React from 'react';
import Geolocation from '@react-native-community/geolocation';
import {
  StyleSheet,
  View,
  ImageBackground,
  Text,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar, 
  Image,
} from 'react-native';
import {fetchLocationId, fetchWeather, fetchLocationIdByCoord} from './utils/api';
import getImageForWeather from './utils/getImageForWeather';
import SearchInput from './components/SearchInput'; //Componente custom creato da me e importato...

export default class App extends React.Component {
  state = {
    initialLat: 0,
    initialLong: 0,
    location: '',
    error: false,
    loading: false,
    temperature: 0,
    weather: '',
    wind: 0,
    humidity: 0,
  }

  componentDidMount() { //Funzione di lifecycle, chiamata tipicamente dopo il costruttore, dopo che i componenti sono stati montati. Usata per effettuare chiamate network asincrone per fetch data-display.
    console.log("Data mounted => going to fetching data...");
    this.getLocation(); //All'avvio setto la posizione corrente con geolocalizzazione...
  }

  getLocation = ()  => {
    this.setState({loading: true}, async () => {
      Geolocation.getCurrentPosition(
        position => {
          const lat = position["coords"]["longitude"];
          const long = position["coords"]["latitude"];

          console.log("Getting initial lat and long...")

          this.setState({initialLat: lat, initialLong: long}, async () => {
            try{
              const locationId = await fetchLocationIdByCoord(lat, long);
              const { location, temperature, weather, wind, humidity } = await fetchWeather(locationId);
      
              console.log("Obtaining meteo info...")

              this.setState({
                loading: false,
                error: false,
                location,
                temperature,
                weather,
                wind, 
                humidity,
              });
            } catch (e){
              this.setState({
                loading: false,
                error: true,
                location: 'Unavailable',
                weather: 'Error',
              });
            }
          })
        },
        error => Alert.alert('Error', JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
      );
    })
  }

  handleUpdateLocation = async (city) => { //async per effettuare un setState() asincrono...
    if(!city) return;

    this.setState({loading: true}, async() => { //setState() con callback asincrona...
      try{
        const locationId = await fetchLocationId(city);
        const { location, temperature, weather, wind, humidity } = await fetchWeather(locationId);

        console.log("Obtaining meteo info...")

        this.setState({
          loading: false,
          error: false,
          location,
          temperature,
          weather,
          wind, 
          humidity,
        });
      } catch (e){
        this.setState({
          loading: false,
          error: true,
          location: city,
          weather: city,
        });
      }
    });
  }

  render() {
    const {loading, error, location, weather, temperature, wind, humidity} = this.state;

    //Questa funzione costruisce la grafica.
    return (
      //KeyboardAvoidingView è un component che serve shifta la grafica in sù quando apro la tastiera.

      /**JSX permette di valutare espressione JS compresi operatori di stato.
       * perciò possiamo renderizzare parti di UI a condizione che... Esempio:
       * !loading && <...> significa che lo stato verrà valutato e mostrerà l'elemento se e solo se loading è false (!false)
       */
      <KeyboardAvoidingView style={styles.container} behavior="height">
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >
          <View style={styles.detailsContainer}>
            <ActivityIndicator animating={loading} color="white" size="large" />

            {!loading && (
              <View>
                {error && (
                  <View>
                    {location=='Credit' && (
                      <Text style={[styles.smallText, styles.textStyle]}>
                        App made by: stocasticamente aremi!
                      </Text>
                    )}

                    {location!='Credit' && (
                      <Text style={[styles.smallText, styles.textStyle]}>
                        Impossibile caricare dati meteo, inserisci un'altra città.
                      </Text>
                    )}
                  </View>
                )}

                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {location}
                    </Text>
                    <Text style={[styles.smallText, styles.textStyle]}>
                      {weather}
                    </Text>
                    <View>
                      <View style={styles.row}>
                        <Image 
                          source={require('./assets/icons/hot.png')}
                          style={styles.icon}
                         />
                        <Text style={[styles.mediumText, styles.textStyle]}>{`${Math.round(temperature)}°`}</Text>
                      </View>

                      <View style={styles.row}>
                      <Image 
                          source={require('./assets/icons/anemometer.png')}
                          style={styles.icon}
                         />
                        <Text style={[styles.mediumText, styles.textStyle]}>{`${Math.round(wind*1.609344)} km/h`}</Text>
                      </View>

                      <View style={styles.row}>
                        <Image 
                          source={require('./assets/icons/humidity.png')}
                          style={styles.icon}
                         />
                        <Text style={[styles.mediumText, styles.textStyle]}>{`${Math.round(humidity)}%`}</Text>
                      </View>
                    </View>
                  </View>
                )}

                <SearchInput
                  placeholder="Cerca una città"
                  onSubmit={this.handleUpdateLocation}
                />
              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

//Stili da applicare ad ogni componente
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 100,
    marginVertical: 5,
  },
  icon: {
    width: 30,
    height: 30,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
  },
  largeText: {
    fontSize: 44,
    color: 'white',
  },
  mediumText: {
    fontSize: 36,
    color: '#bbb',
  },
  smallText: {
    fontSize: 18,
    color: 'white',
  },
});
