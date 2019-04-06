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

const ACCESS_TOKEN = 'user_token';
const EMAIL_ADDRESS = 'email_address';
const POST_URL = 'https://django-fyp.herokuapp.com/healthform';

export default class HealthFormScreen extends React.Component {

	static navigationOptions = {
		title: 'Build your health profile!',
	};

  constructor(props) {
      super(props);
      this.state = {
					modalVisible: false,
					loading: true,

					sex: 'M',
					age: '',
					weight: '',
					height: '',

					consume_level: 'high',
					calories: '',
					smoking: false,
					drinking: false,
					illness: [],
					illnessList: [],

					tastes_piquant: false,
					tastes_bitter: false,
					tastes_sweet: false,
					tastes_meaty: false,
					tastes_salty: false,
					tastes_sour: false,

					taboos: [],
      };
			this.getEmail();
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
		fetch(POST_URL+'/illness/', {
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
				// Alert.alert('An error occured in submitting form data', error);
				console.error(error);
				return [];
			}
		).done();
	}

	async getEmail() {
    try{
      let email = await AsyncStorage.getItem(EMAIL_ADDRESS);
      console.log('[getEmail] Email is:' + email);
      this.setState({email});
    } catch (err) {
      // console.log('[getEmail] Error')
			console.error(err);
    }
  }

	async storeToken(accessToken) {
    try{
      await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
      this.getToken();
    } catch (err) {
      console.log('[storeToken] Error')
    }
  }

	async submit() {
		this.setState({loading: true});
		if (this.validate() == false) {
				Alert.alert('Cannot submit form', 'Make sure you have filled in all boxes with valid values.');
			}
		else
		{
			let tastes_array = [];
			['piquant', 'bitter', 'sweet', 'meaty', 'salty', 'sour'].forEach((taste) => {
				// console.warn('tastes_'+taste);
				if (this.state['tastes_'+taste] === true){
					tastes_array.push(taste);
				}
			});
			// console.warn(tastes_array);

			let illness_array = [];
			tabillness = this.state.illness;
			illness_array = tabillness.slice(0);
			while (illness_array.lastIndexOf('') > 0) {
				illness_array = illness_array.splice(illness_array.lastIndexOf(''), 1);
			}
			// console.warn(taboos_array);

			let taboos_array = [];
			taboos = this.state.taboos;
			taboos_array = taboos.slice(0);
			while (taboos_array.lastIndexOf('') > 0) {
				taboos_array = taboos_array.splice(taboos_array.lastIndexOf(''), 1);
			}
			// console.warn(taboos_array);

			let email = this.state.email;

			// let form = new FormData();
			// form.append("email", email);
			// form.append("sex", "M");
			// form.append("age", 21);
			// form.append("height", 180);
			// form.append("weight", 52);
			//
			// form.append("consume_level", "low");
			// form.append("calories", 1500);
			// form.append("smoking", false);
			// form.append("drinking", false);
			//
			// form.append("tastes", tastes_array);
			// form.append("taboos", taboos_array);

			// console.warn(form);

			let form = JSON.stringify({
				email: email,
				sex: this.state.sex,
				age: this.state.age,
				weight: this.state.weight,
				height: this.state.height,

				consume_level: this.state.consume_level,
				calories: this.state.calories,
				smoking: this.state.smoking,
				drinking: this.state.drinking,
				illness: illness_array,

				tastes: tastes_array,
				taboos: taboos_array
			});

			fetch(POST_URL+'/insert/', {
        method: 'POST',
				headers: {
					"Content-Type" : "text/plain",
				},
        body: form,
      }).then((response) => {
				console.warn(response);
				const statusCode = response.status;
				if (statusCode == 200) {
					let responsetext = response.text();
					this.storeToken(responsetext);
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
			    // Alert.alert('An error occured in submitting form data', error);
					console.error(error);
			  }
			).done();
		}
		this.setState({'loading': false});
	}

  async switchToApp() {
    try {
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
		else if (field === 'calories') {
			calories = this.state.calories;
			if (calories == '') return false;
			if (!this.isInt(calories)) return false;
			if (Number(calories) < 0 || Number(calories) > 3000) return false;
			else return true;
		}
		else {
			return this.validate('age')
					&& this.validate('weight')
					&& this.validate('height')
					&& this.validate('calories');
					// && this.validate('illness')
					// && this.validate('tastes')
					// && this.validate('taboos');
		}
	}

	/* dynamic input fields related */

	createTextInput(field) {
		if (!['taboos'].includes(field)) return false;

		// textboxes = this.state[field + '_textboxes'];
		let texts = this.state[field];

		// const textbox = <TextInput
		// 	style = {styles.textInput}
		// 	onChangeText={(text) => {}} />;

		// console.warn(texts[texts.length - 1]);
		if (texts[texts.length - 1] === '') return false;

		// textboxes.push(textbox);
		texts.push('');
		this.setState({
			/* [field+'_textboxes']: textboxes, */
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
	    	<ScrollView style={{flex: 1}} >
					{ /*
						<Title style={styles.header}>Build Your User Profile!</Title>
						{divider}
					*/ }
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
							<Text style={styles.question}>Daily calories consumption:</Text>
								<TextInput
									style={{...styles.textInput, ...this.validate('calories', this.state.calories) || this.state.calories == ''? styles.textInput_valid: styles.textInput_invalid, }}
									placeholder={'Any integer between 0 and 3000'}
									keyboardType = 'number-pad'
									value = {this.state.calories}
									onChangeText={(text) => {
										this.setState({calories: text});
									}}
								/>
								{
									this.state.calories == ''
									? <Text style={styles.invalidText}>This is a required field.</Text>
									: (this.validate('calories', this.state.calories) === false
										? <Text style={styles.invalidText}>Please input any integer between 0 and 3000.</Text>
										: <View />
									)
								}
							{
								/*
								<Row style={styles.question}>
									<Row>
										<Text>Smoking</Text>
										<CheckBox
											checked={this.state.smoking}
											onPress={() => {
												this.setState({smoking: !this.state.smoking});
											}}/>
										</Row>
									<Row>
										<Text>Drinking</Text>
										<CheckBox
											checked={this.state.drinking}
											onPress={() => {
												this.setState({drinking: !this.state.drinking});
											}}/>
										</Row>
								</Row>
								*/
							}


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
							{
								/*
								<Text style={styles.question}>Your favourite tastes:</Text>
									<Row style={styles.question}>
										<Row>
											<Text>Spicy</Text>
											<CheckBox
												checked={this.state.tastes_piquant}
												onPress={() => {
													this.setState({tastes_piquant: !this.state.tastes_piquant});
												}}/>
											</Row>
										<Row>
											<Text>Bitter</Text>
											<CheckBox
												checked={this.state.tastes_bitter}
												onPress={() => {
													this.setState({tastes_bitter: !this.state.tastes_bitter});
												}}/>
											</Row>
										<Row>
											<Text>Sweet</Text>
											<CheckBox
												checked={this.state.tastes_sweet}
												onPress={() => {
													this.setState({tastes_sweet: !this.state.tastes_sweet});
												}}/>
											</Row>
									</Row>
									<Row style={styles.question}>
										<Row>
											<Text>Savoury</Text>
											<CheckBox
												checked={this.state.tastes_meaty}
												onPress={() => {
													this.setState({tastes_meaty: !this.state.tastes_meaty});
												}}/>
											</Row>
										<Row>
											<Text>Salty</Text>
											<CheckBox
												checked={this.state.tastes_salty}
												onPress={() => {
													this.setState({tastes_salty: !this.state.tastes_salty});
												}}/>
											</Row>
										<Row>
											<Text>Sour</Text>
											<CheckBox
												checked={this.state.tastes_sour}
												onPress={() => {
													this.setState({tastes_sour: !this.state.tastes_sour});
												}}/>
											</Row>
									</Row>
								*/
							}


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
