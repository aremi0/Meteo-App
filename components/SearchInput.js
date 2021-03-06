import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import PropTypes from 'prop-types'

export default class SearchInput extends React.Component {
  state = {
    text: '',
  }

  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    placeholder: PropTypes.string
  }

  static defaultProps = {
    placeholder: ''
  }

  handleChangeText = (text) => {
    this.setState({text});
  }

  handleSubmitEditing = () => { //Se dopo aver scritto, premo invio...
    const {onSubmit} = this.props;
    const {text} = this.state;

    if(!text) return; //Se il testo è vuoto esco...

    onSubmit(text);
    this.setState({text: ''});
  }

  render() {
    const {placeholder} = this.props;
    const {text} = this.state;

    return (
      <View style={styles.container}>
        <TextInput
          value={text}
          placeholder={placeholder}
          autoCorrect={false}
          placeholderTextColor="#aaa"
          underlineColorAndroid="transparent"
          style={styles.textInput}
          clearButtonMode="always"

          onChangeText={this.handleChangeText}
          onSubmitEditing={this.handleSubmitEditing}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    marginTop: 20,
    backgroundColor: '#666',
    marginHorizontal: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textInput: {
    flex: 1,
    color: 'white',
  },
});
