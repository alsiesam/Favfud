import React from 'react';
import { StatusBar, ScrollView, ActivityIndicator, StyleSheet, Alert, AsyncStorage,  } from 'react-native';
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

const ACCESS_TOKEN = 'abc1234';
const POST_URL = 'https://fypbackend.herokuapp.com/healthform/';

export default class HealthFormScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user_token: 'abc1234',
						loading: true,

						sex: 'M',
						age: '',
						weight: '',
						height: '',

						consume_level: 'high',
						calories: '',
						smoking: false,
						drinking: false,

						tastes_piquant: false,
						tastes_bitter: false,
						tastes_sweet: false,
						tastes_meaty: false,
						tastes_salty: false,
						tastes_sour: false,

						taboos: [],
        };
    }

		componentDidMount() {
			// this.createTextInput('tastes');
			this.createTextInput('taboos');
			this.setState({
				'email': this.getEmail(),
				'loading': false,
			})
		}

		async submit() {
			this.setState({'loading': true});
			if (this.validate() == false) {
				Alert.alert('Cannot submit form', 'Make sure you have filled in all boxes with valid values.');
			}
			else
			{
				let formData = new FormData();
				formData.append('email', this.state.email);
				formData.append("sex", this.state.sex);
				formData.append("age", parseInt(this.state.age));
				formData.append("weight", parseFloat(this.state.weight));
				formData.append("height", parseFloat(this.state.height));

				formData.append("consume_level", this.state.consume_level);
				formData.append("calories", parseFloat(this.state.calories));
				formData.append("smoking", this.state.smoking);
				formData.append("drinking", this.state.drinking);

				let tastes = [];
				['piquant', 'bitter', 'sweet', 'meaty', 'salty', 'sour'].forEach((taste) => {
					// console.warn('tastes_'+taste);
					if (this.state['tastes_'+taste] === true){
						tastes.push(taste);
					}
				});
				formData.append("tastes", tastes);

				let taboos = [];
				taboos = this.state.taboos;
				while (taboos.indexOf('') !== -1) {
					taboos.splice(taboos.indexOf(''), 1);
				}
				formData.append("taboos", taboos);

				let email = await this.getEmail();

				fetch(POST_URL, {
	        method: 'GET',
	        headers: {
						email
	        },
	        // body: formData,
	      }).then((response) => {
	        console.log(response);
	        if (response.key) {
	          this.switchToApp();
						console.log(response);
	        } else {
	          console.log(response);
	        }
	      }).catch((error) => {
				    console.warn(error);
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

		async getEmail() {
	    try{
	      let email = await AsyncStorage.getItem(EMAIL_ADDRESS);
	      console.log('[getEmail] Email is:' + email);
	      this.setState({stored_email: email});
	    } catch (err) {
	      console.log('[getEmail] Error')
	    }
	  }

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

		createTextInput(field) {
			if (field !== 'taboos') return false;

			// textboxes = this.state[field + '_textboxes'];
			texts = this.state[field];

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
			if (field !== 'taboos') return false;

			texts = this.state[field];
			key = texts.length;

			texts[pos] = text;

			this.setState({
				[field]: texts,
			});
		}

		removeTextInput(field, pos) {
			if (field !== 'taboos') return false;

			// textboxes = this.state[field + '_textboxes'];
			texts = this.state[field];
			key = texts.length;

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
										placeholder={'Any positive number'}
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
							</Col>
						{divider}

						<Title style={styles.header}>Eating Habits</Title>
							<Col>
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
					{
						this.state.loading
						? (
							<Overlay styleName='fill-parent'>
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
