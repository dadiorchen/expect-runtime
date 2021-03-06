const myExpect = require("./expect");

describe("expect", () => {

  it("defined", () => {
    let a;
    expect(() => {
      myExpect(a).defined();
    }).toThrow();

    a = 1;
    expect(() => {
      myExpect(a).defined();
    }).not.toThrow();
  });

  it("not.defined", () => {
    let a = 1;
    expect(() => {
      myExpect(a).not.defined();
    }).toThrow();
  });

  it("{a:1} property('a')", () => {
    myExpect({a:1}).property("a");
  });

  it("{a:1} property('b') should throw", () => {
    expect(() => {
      myExpect({a:1}).property("b");
    });
  });

  it("{a:1} defined.property('a').number()", () => {
    let o = {a:1};
    myExpect(o).defined().property("a").number();
  });

  it("{a:[1]} defined.property('a').property(0).number()", () => {
    let o = {a:[1]};
    myExpect(o).defined().property("a").property(0).number();
  });

  it("{a:1, b:'s'} match({a:1,b:'s'))", () => {
    myExpect({a:1, b:'s'}).match({a:1,b:'s'});
  });

  it("{a:1, b:'s'} match({a:'1',b:'s')) should throw", () => {
    expect(() => {
      myExpect({a:1, b:'s'}).match({a:'1',b:'s'});
    }).toThrow();
  });

  it("{a:1, b:'s', c:true} match({a:expect.any(Number),b:expect.any(String),c:expect.anything()))", () => {
    myExpect({a:1, b:'s', c: true}).match({
      a:myExpect.any(Number),
      b:myExpect.any(String),
      c:myExpect.anything(),});
  });

  it("'123' match(/\\d+/)", () => {
    myExpect('123').match(/\d+/);
  });

  it("'abc' match(/^a/)", () => {
    myExpect('abc').match(/^a/);
  });

  it("undefined match {a:1} should throw", () => {
    expect(() => {
      myExpect(undefined).match({a:1});
    }).toThrow();
  });

  it("match {a: {b: 1}}", () => {
    myExpect({a: {b:1}}).match({a: {b:1}});
  });

  it("match {a: {b: {c: 1}}}", () => {
    myExpect({a: {b: {c:1}}}).match({a: {b: {c:1}}});
  });

  it("match {a: [1, 2]}}", () => {
    myExpect({a: [1,2]}).match({a: myExpect.any(Array)});
  });

  it("[1, 2] match [any(Number)]", () => {
    myExpect([1,2]).match([myExpect.any(Number)]);
  });

  it("['1', '2'] match [any(Number)] should throw", () => {
    expect(() => {
      myExpect(["1","2"]).match([myExpect.any(Number)]);
    }).toThrow();
  });

  it("[{a:1, b:2, c: 's'}] match [{a:expect.any(Number), b: 2, c: any(String)}] should throw", () => {
    myExpect([{
      a:1,
      b: 2,
      c: "s",
    }]).match([{
      a: myExpect.any(Number),
      b: 2,
      c: myExpect.any(String),
    }]);
  });

  it("{a:1} to.has.property('a').which.is.defined().that.is.number()", () => {
    myExpect({a:1}).to.has.property("a").which.is.defined().and.that.is.number();
  });

  it("[1,2] to.have.lengthOf(2)", () => {
    myExpect([1,2]).to.have.lengthOf(2);
  });

  it("[1,2] to.have.lengthOf.above(0)", () => {
    myExpect([1,2]).to.have.lengthOf.above(0);
  });

  it("[1,2] to.have.lengthOf.most(2)", () => {
    myExpect([1,2]).to.have.lengthOf.most(2);
  });

  it("[1,2] to.have.lengthOf.below(2)", () => {
    myExpect([1,2]).to.have.lengthOf.below(3);
  });

  it("[1,2] to.have.lengthOf.least(2)", () => {
    myExpect([1,2]).to.have.lengthOf.least(0);
  });

  describe("a", () => {
    it("1 to.be.a(1)", () => {
      myExpect(1).to.be.a(1);
    });

    it("1 to.be.a(expect.any(Number))", () => {
      myExpect(1).to.be.a(myExpect.any(Number));
    });

    it("1 to.be.a(expect.any(String)) should throw", () => {
      expect(() => {
        myExpect(1).to.be.a(myExpect.any(String));
      }).toThrow();
    });

    it("[1] to.be.a(expect.any(Array))", () => {
      myExpect([1]).to.be.a(myExpect.any(Array));
    });

    it("1 to.be.a(expect.any(Array)) should throw", () => {
      expect(() => {
        myExpect(1).to.be.a(myExpect.any(Array));
      }).toThrow();
    });

    it("[1] to.be.a('array')", () => {
      myExpect([1]).to.be.a("array");
    });

    it("'s' to.be.a('string')", () => {
      myExpect('s').to.be.a("string");
    });

    it("{s:1} to.be.an('object')", () => {
      myExpect({s:1}).to.be.an("object");
    });

    it("() => {} to.be.an('function')", () => {
      myExpect(() => {}).to.be.an("function");
    });

    it("1 to.be.an('xxx') should throw", () => {
      expect(() => {
        myExpect("xxx").to.be.an("xxx");
      }).toThrow();
    });

    it("1 to.be.a('number')", () => {
      myExpect(1).to.be.a("number");
    });
  });


  it("{a: 'abc'} match({a: expect.stringMatching(/^a/)})", () => {
    myExpect({a:"abc"}).match({
      a: myExpect.stringMatching(/^a/),
    });
  });

  it("most;least;above;below", () => {
    myExpect(1).least(1);
    myExpect(2).least(1);
    expect(() => {
      myExpect(1).least(2);
    }).toThrow();

    myExpect(2).most(2);
    myExpect(1).most(2);
    expect(() => {
      myExpect(2).most(1);
    }).toThrow();

    myExpect(2).above(1);
    expect(() => {
      myExpect(1).above(1);
    }).toThrow();

    myExpect(1).below(2);
    expect(() => {
      myExpect(1).below(1);
    }).toThrow();
  });

  it("1 to.equal(1)", () => {
    myExpect(1).to.equal(1);
  });

  it("1 to.eq(1)", () => {
    myExpect(1).to.eq(1);
  });

  it("1 to.equal(2) throw", () => {
    expect(() => {
      myExpect(1).to.equal(2);
    }).toThrow();
  });

  it("1 to.not.equal(2)", () => {
    myExpect(1).to.not.equal(2);
  });

  it("'a' oneOf(['a', 'b'])", () => {
    myExpect('a').oneOf(['a', 'b']);
  });

  it("'c' oneOf(['a', 'b']) should throw", () => {
    expect(() => {
      myExpect('c').oneOf(['a', 'b']);
    }).toThrow();
  });

  it("1 within(0,1)", () => {
    myExpect(1).within(0,1);
  });

  it("2 within(0,1) should throw", () => {
    expect(() => {
      myExpect(2).within(0,1);
    }).toThrow();
  });

  it("-1 within(0,1) should throw", () => {
    expect(() => {
      myExpect(-1).within(0,1);
    });
  });

  it("() => a(any(Function)) ", () => {
    myExpect(() => {}).a(myExpect.any(Function));
  });

  it("To call the actual", () => {
    const o = {
      s: () => console.log("call s"),
    };
    myExpect(o)
      .property("s")
      .defined()
      .actual();
  });

  it("Print object", () => {
    const b = {
      foo: {
        bar: null,
        bar2: {
          c: null,
        },
      },
      toString: () => "this is string",
    };
    b.foo.bar = b;
    const string = myExpect.stringify(b);
    console.log("print:", string);
    expect(string).toMatch(/^{.*/mi);
  });

  it("Print object instance", () => {
    const instance = myExpect.anything();
    const string = myExpect.stringify(instance);
    console.log("print:", string);
    expect(string).toMatch(/^\[.*{.*/mi);
  });

  it("Fail", () => {
    expect(() => {
      myExpect.fail();
    });
  });

  it("Print string message", () => {
    expect(() => {
      myExpect(1, "this is impossible").equal(2);
    }).toThrow(/this is impossible/);
  });

  it("Print string message in async fn", () => {
    async function t(){
      myExpect("tes t", "this is impossible").match(/test/);
    }
    expect(async () => {
      await t();
    }).rejects.toThrow(/this is impossible/);
  });

  it("Print callable message", () => {
    expect(() => {
      myExpect(1, () => new Error("this is impossible")).equal(2);
    }).toThrow(Error);
  });

  it("Print string message", () => {
    expect(() => {
      myExpect({a:[1]}, "xxxxx").property("a").lengthOf.above(2);
    }).toThrow(/xxxx/);
  });

  it("A instanceOf A", () => {
    class A {}
    const a = new A();
    myExpect(a).instanceOf(A);
    expect(() => {
      myExpect(a).instanceOf(String);
    }).toThrow(/instanceof/i);
  });

  describe("error message", () => {

    it("pring number", () => {
      expect(() => {
        myExpect(-1234).above(2);
      }).toThrow(/1234/i);
    });

    it("pring array", () => {
      expect(() => {
        myExpect([1,2]).lengthOf(1);
      }).toThrow(/1,2/i);
    });

    it("pring big array", () => {
      expect(() => {
        myExpect(Array.from(new Array(1000)).map(_ => "xxxx")).lengthOf(1);
      }).toThrow(/xxxx/i);
    });

    it("pring complicated element in array", () => {
      expect(() => {
        myExpect([{b:1}]).match({a:1});
      }).toThrow(/b.*:.*1/i);
    });
  });

    describe("any", () => {

      it("any('string')", () => {
        myExpect("s").a(myExpect.any("string"));
      });

      it("any('number')", () => {
        myExpect(1).a(myExpect.any("number"));
      });

      it("any('function')", () => {
        myExpect(() => {}).a(myExpect.any("function"));
      });
    });


});

