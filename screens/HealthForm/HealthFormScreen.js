import React from 'react';
import { StatusBar, ScrollView, Modal, ActivityIndicator, StyleSheet, Alert, AsyncStorage,  } from 'react-native';
import { Divider } from "react-native-elements";
import { Container, Icon, Picker, CheckBox, } from "native-base";
import { Col, Row, Grid } from "react-native-easy-grid";
import {
  Title,
  Text,
	TouchableOpacity,
  TextInput,
  Button,
  View,
	Overlay,
} from '@shoutem/ui';
import StatusBarBackground from '../../components/StatusBarBackground';

const ACCESS_TOKEN = 'user_token';
const EMAIL_ADDRESS = 'email_address';
const API_HOST = 'https://django-fyp.herokuapp.com';
const HEALTHFORM_POST_URL = `${API_HOST}/healthform/insert/`;
const ILLNESS_GET_URL = `${API_HOST}/healthform/illness/`;
const REGISTER_REQUEST_URL = 'https://favfud-app.herokuapp.com/api/rest-auth/registration/';

export default class HealthFormScreen extends React.Component {

	static navigationOptions = {
		title: 'Build your health profile!',
	};

  constructor(props) {
      super(props);
      this.state = {
					register_email: props.navigation.state.params.register_email,
					//register_password: props.navigation.state.params.register_password,
					token: '',
          credentials: props.navigation.state.params.credentials,

					modalVisible: false,
					loading: true,

					sex: 'M',
					age: '',
					weight: '',
					height: '',

					consume_level: 'high',
					illness: [],
					illnessList: [],

					taboos: [],
			};
			//console.log([this.state.register_email, this.state.token]);
			this.getIllnessList();
  }

	componentDidMount() {
			this.createTextInput('taboos');
			this.setState({
				loading: false,
			});
		}

	/* async functions: fetch related */

	async getIllnessList() {
		fetch(ILLNESS_GET_URL, {
			method: 'GET',
			headers: {
			},
		}).then((response) => response.json())
		.then((responsejson) => {
			// console.warn(responsejson);

			var result = [];
			responsejson.forEach((obj, ind) => {
				let illnessName = obj['disease_name'];
				result.push(illnessName);
			});
			result.sort();

			this.setState({illnessList: [...this.state.illnessList, ...result]});
		}).catch((error) => {
				Alert.alert('An error occured in submitting form data', error);
				console.error(error);
				return [];
			}
		).done();
	}

	async storeToken(accessToken) {
    try{
      await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
      this.getToken();
    } catch (err) {
      console.log('[storeToken] Error')
    }
  }

  async sendRegisterRequest(credentials) {
    try {
      // console.log(credentials);
      let response = await fetch(REGISTER_REQUEST_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      let responseJson = await response.json();
      return responseJson;
    } catch (err) {
      console.log("sendRegisterRequest error");
      return false;
    }
  }

  showAlert(title, message) {
    Alert.alert(
      title,
      message,
      [
        {text: 'OK'},
      ],
      {cancelable: false},
    );
  }

  showErrorMsg(response) {
    if (response.non_field_errors) {
      this.showAlert('Error', response.non_field_errors.toString());
      this.props.navigation.navigate('Auth');
    }
    if (response.password1) {
      this.showAlert('Error: Password', response.password1.toString());
      this.props.navigation.navigate('Auth');
    }
    if (response.password) {
      this.showAlert('Error: Password', response.password.toString());
      this.props.navigation.navigate('Auth');
    }
    if (response.email) {
      this.showAlert('Error: Email', response.email.toString());
      this.props.navigation.navigate('Auth');
    }
  }

	async submit() {
		this.setState({loading: true});
		if (this.validate() == false) {
				Alert.alert('Cannot submit form', 'Make sure you have filled in all boxes with valid values.');
			}
		else
		{
			let illness_array = [];
			tabillness = this.state.illness;
			illness_array = tabillness.slice(0);
			while (illness_array.lastIndexOf('') > 0) {
				illness_array = illness_array.splice(illness_array.lastIndexOf(''), 1);
			}

			let taboos_array = [];
			taboos = this.state.taboos;
			taboos_array = taboos.slice(0);
			while (taboos_array.lastIndexOf('') > 0) {
				taboos_array = taboos_array.splice(taboos_array.lastIndexOf(''), 1);
			}

			let response_token = await this.createAccount(this.state.credentials);
			if(response_token){
				let form = JSON.stringify({
					user_token: response_token,
					sex: this.state.sex,
					age: this.state.age,
					weight: this.state.weight,
					height: this.state.height,

					consume_level: this.state.consume_level,
					illness: illness_array,

					taboos: taboos_array
				});

				// console.log(form);
				await this.insertHealthFormRecord(form);
			}
		}
		this.setState({'loading': false});
	}

	async createAccount(credentials) {
		let response = await this.sendRegisterRequest(this.state.credentials);
		if (response.key) {
			this.setState({token: response.key});
			return response.key;
		} else {
			this.showErrorMsg(response);
			console.log("Error");
		}
		return null;
	}

	async insertHealthFormRecord(form) {
		fetch(HEALTHFORM_POST_URL, {
			method: 'POST',
			headers: {
				"Content-Type" : "text/plain",
			},
			body: form,
		}).then((response) => {
			// console.warn(response);
			const statusCode = response.status;
			if (statusCode == 200) {
				this.switchToApp();
			}
			else if(statusCode == 400) {
				let responseText = response.text();
				Alert.alert('An error occured in submitting form data', responseText);
			}
			else {
				Alert.alert('An error occured in the server', 'Please try again or contact us.');
			}
		}).catch((error) => {
				console.error(error);
			}
		).done();
	}

	async storeToken(accessToken) {
    try{
      await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
    } catch (err) {
      console.log('[storeToken] Error')
    }
  }

  async storeEmail(email) {
    try{
      await AsyncStorage.setItem(EMAIL_ADDRESS, email);
    } catch (err) {
      console.log('[storeEmail] Error')
    }
  }

  async switchToApp(user_token=this.state.token, email=this.state.register_email) {
    try {
      await this.storeToken(user_token);
      await this.storeEmail(email);
      this.props.navigation.navigate('App');
    } catch (err) {
      console.log("[switchToApp] Error");
      console.log(err);
    }
  }

	/* validation related */

	isInt(n){
		return n.search(/,/g) === -1 && parseInt(n) !== NaN && parseFloat(n) % 1 === 0;
	}

	isFloat(n){
		return n.search(/,/g) === -1 && parseFloat(n) !== NaN;
	}

	validate(field, text) {
		if (field === 'age') {
			age = this.state.age;
			if (age === '') return false;
			if (!this.isInt(age)) return false;
			else if (parseInt(age) <= 0) return false;
			else return true;
		}
		else if (field === 'weight') {
			weight = this.state.weight;
			if (weight == '') return false;
			if (!this.isFloat(weight)) return false;
			if (Number(weight) <= 0) return false;
			else return true;
		}
		else if (field === 'height') {
			height = this.state.height;
			if (height == '') return false;
			if (!this.isFloat(height)) return false;
			if (Number(height) <= 0) return false;
			else return true;
		}
		else {
			return this.validate('age')
					&& this.validate('weight')
					&& this.validate('height')
		}
	}

	/* dynamic input fields related */

	createTextInput(field) {
		if (!['taboos'].includes(field)) return false;
		let texts = this.state[field];
		if (texts[texts.length - 1] === '') return false;

		texts.push('');
		this.setState({
			[field]: texts,
		});
	}

	changeTextInput(field, pos, text) {
		if (!['taboos'].includes(field) ) return false;

		let texts = this.state[field];
		let key = texts.length;

		texts[pos] = text;

		this.setState({
			[field]: texts,
		});
	}

	removeTextInput(field, pos) {
		if (!['taboos'].includes(field)) return false;

		// textboxes = this.state[field + '_textboxes'];
		let texts = this.state[field];
		let key = texts.length;

		if (texts.length <= 1) {
			return;
		}

		// textboxes.splice(pos, 1);
		texts.splice(pos, 1);

		this.setState({
			/* [field+'_textboxes']: textboxes, */
			[field]: texts,
		});
	}

	/* dynamic checkboxes related */

	toggleCheckboxInput(field, value) {
		if (!['illness'].includes(field)) return false;

		let texts = this.state[field];

		let pos = texts.indexOf(value);

		if (pos < 0) {
			texts.push(value);
			texts.sort();
		}
		else {
			texts.splice(pos, 1);
		}

		this.setState({
			[field]: texts,
		});
	}

  render() {
		const divider = <Divider style={{ marginTop: 10, marginBottom: 10, }} />;
    return (
			<Container style={styles.container}>
				<StatusBarBackground />
	    	<ScrollView style={{flex: 1}} >
					<Title style={styles.header}>Body Indices</Title>
						<Col>
							<Text style={styles.question}>Sex:</Text>
								<Row>
									<Button
										styleName="clear"
										onPress = {() => this.setState({sex: 'M'})}>
									  <Icon ios='ios-man' android="md-man" name = 'male'
											style={{...styles.buttonInput, ...this.state.sex=='M'? {color: 'blue'}: {color: 'grey'} }}/>
									</Button>
									<Button
										styleName="clear"
										onPress = {() => this.setState({sex: 'F'})}>
									  <Icon ios='ios-woman' android="md-woman" name = 'woman'
											style={{...styles.buttonInput, ...this.state.sex=='F'? {color: 'red'}: {color: 'grey'} }}/>
									</Button>
								</Row>
							<Text style={styles.question}>Age:</Text>
								<TextInput
									style={{...styles.textInput, ...this.validate('age', this.state.age) || this.state.age == '' ? styles.textInput_valid: styles.textInput_invalid, }}
									placeholder={'Any positive integer'}
									keyboardType = 'number-pad'
									maxLength = {2}
									value = {this.state.age}
									onChangeText={(text) => {
										this.setState({age: text});
									}}
								/>
								{
									this.state.age == ''
									? <Text style={styles.invalidText}>This is a required field.</Text>
									: (this.validate('age', this.state.age) === false
										? <Text style={styles.invalidText}>Please input an integer greater than 0.</Text>
										: <View />
									)
								}
							<Text style={styles.question}>Height (in cm):</Text>
								<TextInput
									style={{...styles.textInput, ...this.validate('height', this.state.height) || this.state.height == '' ? styles.textInput_valid: styles.textInput_invalid, }}
									placeholder={'Any positive number'}
									keyboardType = 'number-pad'
									value = {this.state.height}
									onChangeText={(text) => {
										this.setState({height: text});
									}}
								/>
								{
									this.state.height == ''
									? <Text style={styles.invalidText}>This is a required field.</Text>
									: (this.validate('height', this.state.height) === false
										? <Text style={styles.invalidText}>Please input any positive number.</Text>
										: <View />
									)
								}
							<Text style={styles.question}>Weight (in kg):</Text>
								<TextInput
									style={{...styles.textInput, ...this.validate('weight', this.state.weight) || this.state.weight == '' ? styles.textInput_valid: styles.textInput_invalid, }}
									placeholder={'Any positive number'}
									keyboardType = 'number-pad'
									value = {this.state.weight}
									onChangeText={(text) => {
										this.setState({weight: text});
									}}
								/>
								{
									this.state.weight == ''
									? <Text style={styles.invalidText}>This is a required field.</Text>
									: (this.validate('weight', this.state.weight) === false
										? <Text style={styles.invalidText}>Please input any positive number.</Text>
										: <View />
									)
								}
						</Col>
					{divider}

					<Title style={styles.header}>Living Habits</Title>
						<Col>
							<Row>
								<Text style={styles.question}>Energy consumption in occupation:</Text>
									<Picker
										mode="dropdown"
										style = {{...styles.picker}}
										selectedValue={this.state.consume_level}
										onValueChange = { (itemValue, itemPosition) => { this.setState({consume_level: itemValue}) }}
									>
										<Picker.Item label="high" value="high" />
										<Picker.Item label="middle" value="middle" />
										<Picker.Item label="low" value="low" />
									</Picker>
								</Row>


							<Text style={styles.question}>Any illness:</Text>
								<Button styleName='clear' style={styles.submitButton} onPress = {() => this.setState({modalVisible: true})}><Text>Choose illness</Text></Button>
								{
									this.state.illness.map((text, key) => {
										return <Text key={key}>{text}</Text>;
									})
								}
							</Col>
					{divider}

					<Title style={styles.header}>Eating Habits</Title>
						<Col>
							<Text style={styles.question}>Your taboos:</Text>
								<Grid>
									{
										this.state.taboos.map((text, key) => {
											const add = <Button
												styleName="clear"
												style={{padding: 0,}}
												onPress = {() => this.createTextInput('taboos')}>
													<Icon ios='ios-add-circle' android="md-add-circle" name = {'add-'+key}
														style={{}}/>
												</Button>;

											const empty = <Button
												styleName="clear"
												style={{padding: 0,}} />;

											const remove = <Button
												styleName="clear"
												style={{padding: 0,}}
												onPress = {() => this.removeTextInput('taboos', key)}>
													<Icon ios='ios-remove-circle' android="md-remove-circle" name = {'move-'+key}
														style={{}}/>
												</Button>;

											let textInput = <TextInput
												key={key}
												style={{...styles.textInput}}
												value={this.state.taboos[key]}
												onChangeText={(text) => {
													this.changeTextInput('taboos', key, text);
												}}
												/>

											return (
												<Row key={key}>
													<Col size={8}>{textInput}</Col>
													<Col size={1}>{add}</Col>
													<Col size={1}>{key > 0? remove: empty}</Col>
												</Row>
											);
										})
									}
								</Grid>
						</Col>
					{divider}

					<Button styleName='clear' style={styles.submitButton} onPress = {() => this.submit()}><Text>SUBMIT</Text></Button>
				</ScrollView>
				<Modal
					animationType="slide"
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						this.setState({modalVisible: false})
					}}
					style={styles.container}>
					<StatusBarBackground />
					<Row size={90}>
						<ScrollView style={{...styles.container, ...{margin: 0, fontSize: 13,}}}>
							<Col>
								{
									this.state.illnessList.map((text, key) => {
										// console.warn(text);
										return (<Row key={key}
												style={{marginTop: 2, marginBottom: 2}}
												onPress={() => {
													this.toggleCheckboxInput('illness', text);
												}}>
											<CheckBox
												checked={this.state.illness.indexOf(text) >= 0}
												style = {{marginRight: 15}}/>
											<Text>{text}</Text>
											</Row>);
									})
								}
							</Col>
						</ScrollView>
					</Row>
					<Row size={10}>
						<View style={{...styles.container, ...{margin: 0, height: 30,}}}>
							<Button styleName='clear' style={styles.submitButton} onPress = {() => this.setState({modalVisible: false})}><Text>CLOSE</Text></Button>
						</View>
					</Row>
				</Modal>
				{
					this.state.loading
					? (
						<Overlay styleName='fill-parent' style={{'backgroundColor': '#cccccc',}}>
							<ActivityIndicator size="large" color="#ffffff" />
						</Overlay>
					)
					: null
				}

			</Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
		margin: 10,
  },
	header: {
    margin: 15,
    fontSize: 20,
		textAlign: 'center',
		fontWeight: 'bold',
  },
	question: {
		marginTop: 15,
	},
	invalidText: {
		fontSize: 10,
		color: 'red',
	},
  textInput: {
    borderBottomWidth: 2,
    height: 30,
    marginTop:5,
    marginBottom:5,
		padding: 2,
  },
	textInput_valid: {
		borderColor: '#808080',
	},
	textInput_invalid: {
		borderColor: '#FF0000',
	},
	picker: {
		borderBottomWidth: 2,
		borderColor: 'grey',
	},
  buttonInput: {
    fontSize: 40,
		 marginLeft: 10,
		 marginRight: 10,
  },
	submitButton: {
    height:40,
    marginTop:10,
    marginBottom:10,
    borderRadius:5,
		borderColor: '#bae1ff',
		backgroundColor: '#bae1ff',
    textAlign: 'center',
	},
});
