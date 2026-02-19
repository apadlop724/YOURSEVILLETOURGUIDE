//comprobacion de eslinntcr y prettierrc
const a = 3;
console.log(a);
let b: number;
///////////////////////

//DATOS PRIMITIVOS
let num: number = 7;
let binary: number = 0b1010010;
let hex: number = 0xfe12;

let isActive: boolean = true;
let is: string = 'true';

//TIPO ANY
let data: any = 56;
data = 'ddd';

//ARRAYS
const names: string[] = [];
names.push('helo');

let names2 = 'helo';
//names2 = 23;

//OBJETOS
let car: object = {
	brand: 'ÇToyote',
	model: 'Corola',
	year: 2000,
};

car = {
	new: true,
};

//UNIONES
let myId: number | string = 29;
myId = 'hel';

//type para definir tipos TS
type id = number | string;
let userId: id = '22222F';
userId = 25;

//Array y uniones
let arr: (number | string | boolean)[] = [10, true, 'helo'];
arr = [false, 'bye'];

//literales
type stateLoading = 'loading';
type stateError = 'error';
type state = stateLoading | stateError;

let state: state = 'error';
state = 'loading';

//Interseciones
type manga = {
	title: string;
	pages: number;
};
type movie = {
	title: string;
	duration: number;
	hasOscars: boolean;
};
type anime = movie & manga;
const giant: anime = {
	title: 'Giant',
	duration: 180,
	hasOscars: false,
	pages: 100,
};

//no usaremos
/*type data = number | string;
let num2: data = 32;
num2 = 'hello';*/

//FUNCIONES
//function sum(n1:number,n2:number):number{ si la funcion es sensilla no es necesario
function sum(n1: number, n2: number) {
	return n1 + n2;
}
let result = sum(10, 20);

const toUpper = (str: string) => str.toUpperCase();
let str: string = toUpper('Hello');

//FUNCIONES GENERICAS, definimos el dato en tiempos de ejecucion
function getFirsElement<T>(array: T[]) {
	return array[0];
}

const numArr: number[] = [10, 3, 4];
let first = getFirsElement(numArr);
console.log(first);

const numStrr: string[] = ['helo', '3', '4'];
let firStr = getFirsElement(numStrr);
console.log(firStr);

//INTERFACES restringe los objetos
interface Monumento<T> {
	name: string;
	descripcion: string;
	age: number;
	data: T;
}

const monument: Monumento<string> = {
	name: 'Peter',
	descripcion: 'Palacio de las cadenas',
	age: 60,
	data: '34',
};

//INTERFACES QUE EXTIENDAN DE OTRAS "extends"
interface PersonaInteface {
	name: string;
	age: number;
}
interface WorkeInterface extends PersonaInteface {
	salary: number;
}
const w2: WorkeInterface = {salary: 2000, name: 'JP', age: 34};

interface FreelanceInterface extends PersonaInteface, WorkeInterface {
	SSN: number;
}
const w23: FreelanceInterface = {
	salary: 2000,
	name: 'JP',
	age: 34,
	SSN: 58785785,
};

//INTERFACES INTEGRACION CON CLASES usando implements
interface IVideo {
	title: string;
}
class Movie implements IVideo {
	constructor(
		public title: string,
		private duracion: number,
		readonly hasOscars: boolean,
	) {} // vacio {} o con inicializacion {title="", duracion=0, hasOscars=false}
}

const movie1 = new Movie('The thing', 180, true);
