class Matcher{}

class Any extends Matcher{
  constructor(sample){
    super();
    //cast
    if(typeof sample === "string"){
      if(sample === "string"){
        this.sample = String;
      }else if(sample === "number"){
        this.sample = Number;
      }else if(sample === "function"){
        this.sample = Function;
      }else if(sample === "object"){
        this.sample = Object;
      }else if(sample === "boolean"){
        this.sample = Boolean;
      }
    }else{
      this.sample = sample;
    }
  }

  equal(other){
    if (this.sample == String) {
      return typeof other == 'string' || other instanceof String;
    }

    if (this.sample == Number) {
      return typeof other == 'number' || other instanceof Number;
    }

    if (this.sample == Function) {
      return typeof other == 'function' || other instanceof Function;
    }

    if (this.sample == Object) {
      return typeof other == 'object';
    }

    if (this.sample == Boolean) {
      return typeof other == 'boolean';
    }

//    /* global BigInt */
//    if (this.sample == BigInt) {
//      return typeof other == 'bigint';
//    }

    if (this.sample == Symbol) {
      return typeof other == 'symbol';
    }

    return other instanceof this.sample;
  }

  toString(){
    return `any of ${this.sample}`;
  }
}

class Anything extends Matcher{
  equal(other){
    if(other !== undefined){
      return true;
    }else{
      return false;
    }
  }
}

class StringMatching extends Matcher{
  constructor(regex){
    super(regex);
    this.regex = regex;
  }

  equal(other){
    return (this.regex.test(other));
  }
}


class Expectation{

  constructor(_actual, message){
    this._actual = _actual;
    this._message = message;
    this.flags = [];
    this.lengthOf.above = (...args) => {
      this.addFlag("lengthOf");
      this.above(...args);
    }
    this.lengthOf.most = (...args) => {
      this.addFlag("lengthOf");
      this.most(...args);
    }
    this.lengthOf.least = (...args) => {
      this.addFlag("lengthOf");
      this.least(...args);
    }
    this.lengthOf.below = (...args) => {
      this.addFlag("lengthOf");
      this.below(...args);
    }
  }

  get to(){return this;}
  get be(){return this;}
  get been(){return this;}
  get is(){return this;}
  get and(){return this;}
  get has(){return this;}
  get have(){return this;}
  get with(){return this;}
  get that(){return this;}
  get which(){return this;}
  get at(){return this;}
  get of(){return this;}
  get same(){return this;}
  get but(){return this;}
  get does(){return this;}
  get still(){return this;}
  get actual(){return this._actual;}

  get not() {
    this.addFlag("not");
    return this;
  }

  addFlag(flag){
    this.flags.push(flag);
  }

  _equal(expectation){
    if(expectation instanceof Matcher){
      return expectation.equal(this._actual);
    }else{
      if(this.flags.includes("not")){
        return this._actual !== expectation;
      }else{
        return this._actual === expectation;
      }
    }
  }

  _equalWithActual(_actual, expectation){
    if(expectation instanceof Matcher){
      return expectation.equal(_actual);
    }else{
      if(this.flags.includes("not")){
        return _actual !== expectation;
      }else{
        return _actual === expectation;
      }
    }
  }

  defined(){
    if(this.flags.includes("not")){
      if(this._actual === undefined){
        //pass
        return this;
      }else{
        this.throw("not be defined");
      }
    }else{
      if(this._actual !== undefined){
        //pass
        return this;
      }else{
        this.throw("be defined");
      }
    }
  }

  number(){
    if(typeof this._actual === "number"){
      //pass
      return this;
    }else{
      this.throw("be number");
    }
  }

  property(propertyName){
    const propertyValue = this._actual[propertyName];
    if(propertyValue === undefined){
      this.throw(`has property:${propertyName}`);
    }else{
      const expectation = new Expectation(propertyValue, this._message);
      return expectation;
    }
  }

  throw(expectMessage){
    let string = stringify(this._actual);
    let flagsString = this.flags.join(" ");
    const expectRuntimeExceptionString = `[assert failed] expect ${string} --to--> ${flagsString} ${expectMessage}`;
    if(!this._message){
      throw new Error(expectRuntimeExceptionString);
    }else{
      if(typeof this._message === "function"){
        //if the message is a function, then execute the fn and throw the return
        throw this._message();
      }else{
        throw new Error(this._message);
      }
    }
  }

  match(object){
    if(this._actual === undefined){
      this.throw(`match ${JSON.stringify(object, null, 2)}`);
    }
    if(object instanceof RegExp){
      if(!object.test(this._actual)){
        this.throw(`match ${object.toString()}`);
      }else{
        return this;
      }
    }else if(object instanceof Array){
      if(object.length !== 1){
        throw Error("just 1 length of array allowed here");
      }
      const target = object[0];
      if(!(this._actual instanceof Array)){
        this.throw(`match array of ${JSON.stringify(target, null, 2)}`);
      }
      if(target instanceof Matcher){
        try{
          this._actual.forEach(a => {
            if(!this._equalWithActual(a, target)){
              throw Error();
            }
          });
        }catch(e){
          this.throw(`match array of ${JSON.stringify(target, null, 2)}`);
        }
      }else{
        try{
          this._actual.forEach(a => {
            expect(a).match(target);
          });
        }catch(e){
          this.throw(`match array of ${JSON.stringify(target, null, 2)}`);
        }
      }

    }else if(typeof object === "object"){
      let matched = true;
      Object.keys(object).forEach(key => {
        const value = object[key];
        const _actualValue = this._actual[key];
        if(typeof value === "object" && !(value instanceof Matcher)){
          //nest object
          expect(_actualValue).match(value);
        }else{
          if(this._equalWithActual(_actualValue, value)){
          }else{
            matched = false;
          }
        }
      });
      if(matched === false){
        this.throw(`match ${JSON.stringify(object, null, 2)}`);
      }else{
        return this;
      }
    }else {
      this.throw(`match ${object}`);
    }
  }

  lengthOf(length){
    if(this._actual.length === length){
      return this;
    }else{
      this.throw(`length of ${length}`);
    }
  }

  a(target){
    //translate string to matcher
    if(typeof target === "string"){
      if(target === "array"){
        target = expect.any(Array); 
      }else if(target === "string"){
        target = expect.any(String); 
      }else if(target === "object"){
        target = expect.any(Object); 
      }else if(target === "number"){
        target = expect.any(Number); 
      }else if(target === "function"){
        target = expect.any(Function); 
      }else{
        throw new Error("do not support type string:" + target);
      }
//      }else if(target === "string"){
//        target = expect.any(String); 
//      }else if(target === "object"){
//        target = expect.any(Object); 
//      }else if(target === "number"){
//      }
    }
    if(this._equal(target)){
      return this;
    }else {
      this.throw(`a ${target}`)
    }
  }

  least(number){
    if(this.flags.includes("lengthOf")){
      if(this._actual.length >= number){
        return this;
      }else {
        this.throw(`least ${number}`)
      }
    }else{
      if(this._actual >= number){
        return this;
      }else {
        this.throw(`least ${number}`)
      }
    }
  }

  most(number){
    if(this.flags.includes("lengthOf")){
      if(this._actual.length <= number){
        return this;
      }else {
        this.throw(`most ${number}`)
      }
    }else{
      if(this._actual <= number){
        return this;
      }else {
        this.throw(`most ${number}`)
      }
    }
  }

  above(number){
    if(this.flags.includes("lengthOf")){
      if(this._actual.length > number){
        return this;
      }else {
        this.throw(`above ${number}`)
      }
    }else{
      if(this._actual > number){
        return this;
      }else {
        this.throw(`above ${number}`)
      }
    }
  }

  below(number){
    if(this.flags.includes("lengthOf")){
      if(this._actual.length < number){
        return this;
      }else {
        this.throw(`below ${number}`)
      }
    }else{
      if(this._actual < number){
        return this;
      }else {
        this.throw(`below ${number}`)
      }
    }
  }

  within(left, right){
    if(this._actual <= right && this._actual >= left){
      return this;
    }else{
      this.throw(`within [${left},${right}]`);
    }
  }

  equal(other){
    if(this._equal(other)){
      return this;
    }else{
      this.throw(`equal ${other}`);
    }
  }

  oneOf(array){
    if(array.includes(this._actual)){
      return this;
    }else{
      this.throw(`one of ${JSON.stringify(array)}`);
    }
  }

  instanceOf(Type){
    if(this._actual instanceof Type){
      return this;
    }else {
      this.throw(`instanceof ${Type}`)
    }
  }

}

//shortcut
Expectation.prototype.an = Expectation.prototype.a;
Expectation.prototype.eq = Expectation.prototype.equal;




function expect(_actual, message){
  const expectation = new Expectation(_actual, message);
  return expectation;
}

expect.any = function(type){
  return new Any(type);
};

expect.anything = function(){
  return new Anything();
};

expect.stringMatching = function(regex){
  return new StringMatching(regex);
};

expect.fail = function(){
  throw Error("expect fail!");
};

function stringify(object){
  if(object === undefined){
    return object;
  }
  if(typeof object === "string"){
    return `'${object}'`;
  }
  if(object instanceof Array){
    let string = `[${object.map(o => stringifyObject(o)).join(",")}]`;
    if(string.length > 500){
      string = `[${object.slice(0,2)},...](length:${object.length})`;
    }
    if(string.length > 500){
      string = `[...](length: ${object.length})`;
    }
    return string;
  }

  if(!isNaN(object)){
    return `${object}`;
  }
  const string = stringifyObject(object);
  return string;
}

function stringifyObject(object){
  let string = "";
  if("number" === typeof object){
    return object + "";
  }
  if(object.constructor.name !== "Object"){
    string += `[${object.constructor.name}] `;
  }
  //conver functions
  let objectCopied = {};
  for(var m in object){
    if(typeof object[m] === "function"){
      objectCopied[m] = "[Function]";
    }else{
      objectCopied[m] = object[m];
    }
  }
  try{
    // Note: cache should not be re-used by repeated calls to JSON.stringify.
    var cache = [];
    let counter = 0;
    string += JSON.stringify(objectCopied, (_key, value) => {
      if (typeof value === "object" && value !== null) {
        // Duplicate reference found, discard key
        if (cache.includes(value)) return "[Circle]";

        // Store value in our collection
        cache.push(value);
      }
      if(counter++ > 200){
        throw Error("stringify reach the limitation!");
      }
      return value;
    },2);
    cache = null; // Enable garbage collection   string = JSON.stringify(objectCopied, censor(object),2);
  }catch(e){
    console.error("stringify failed:", e, "the source:", objectCopied);
    string += object;
  }
  return string;
}

expect.stringify = stringify;

module.exports = expect;
