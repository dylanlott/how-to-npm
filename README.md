# How To Write and Publish Your Library to NPM

# What is npm and why do I need it? 
npm is the de-facto standard package manager for Node. It ships with Node.js installations by default, and although there have been other package managers to come out (yarn and bower to name a few) npm has risen to be the standard that everyone else rallied around.

## What will this guide achieve?
This guide will show you how to:

- Create a javascript library from scratch
- Link it to a local project for development
- Publish it to npm
- Setup a test suite for it

The main goal is to get you started and published to npm as quickly as possible, and then dive in to some of the features. 

# Diving in: Start our first JS library
Before you start your library, you need to decide what it’s going to do.
This is important, because you should follow the UNIX principle:

`Do one thing and do it well`

In this example, I’m going to create a library that takes in a crypto toke and returns the asset in USD. This is a simple enough task but will touch on enough moving parts that you’ll be able to get a good grasp of unit testing and module development with it. 

## Start your library: `npm init` 
The `init` command will initialize a new library for you. To do this, it runs you through a quick set of questions to setup the library. 

This is where you can pick the name of the package, set the initial version, write a description for it, set the entry point of the package, list the test command, and license the package (here’s a fun tip: license it as “AGPL-3.0”) 
```
> $ npm init                                                                                                                                                                                      ⬡ 7.10.1
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help json` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg> --save` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
name: (my-lib)
version: (1.0.0)
description: my first javascript library
entry point: (index.js)
test command:
git repository:
keywords:
author:
license: (ISC)
About to write to /Users/dylanlott/Development/my-lib/package.json:

{
  "name": "my-lib",
  "version": "1.0.0",
  "description": "my first javascript library",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC"
}


Is this ok? (yes)
```

Hit enter when you get to `Is this ok?` and it’ll exit you out and create the package.json file for you. 

## Write our library
1.  Create our project structure
We’re going for a very simple project structure for this. 
Let’s create our structure and add our index.js file 

```
$ mkdir test lib
$ touch index.js
```

Your structure should now look like
```
./my-lib
    ├── index.js
    ├── lib
    ├── package.json
    └── test
```

2. Outside-In development

I usually like to approach development of modules like this with the “outside-in” approach.

This means we should define what the api of our library should look like before we start development. 

We’re going to write a very simple library for the purposes of this tutorial. Our library will add two numbers together and return the result. 

**Note** - I use this approach combined with test driven development.

I think the use of this library should look something like this:
```
const adder = require('my-lib');
const added = adder(1, 2);
```

Now that we’ve defined how we want to use our library, let’s write our test for it. 

3. Tests
`npm install mocha sinon chai` 

Mocha is the test runner we’re going to use.  Mocha will, by default, run all the test files in the `./test` directory of your root. 

Let’s create our index.js for tests.
`touch test/index.js` 

Open it up, and let’s write our first test. 

```
const sinon = require('sinon');
const expect = require('chai').expect;
const adder = require('..');

let sandbox;

beforeEach(function () {
    sandbox = sinon.sandbox.create();
});

afterEach(function () {
    sandbox.restore();
});

describe('#adder', function () {
  it('should add two numbers', function (done) {
    const added = adder(1, 2);
    expect(added).to.equal(3);
    expect(added).to.be.a('Number');
    done();
  });
});
```

This is going to be our barebones test setup. 

Let’s go through this and figure out exactly what we did. 

We imported our test modules and the library we’re testing (`lib`) and then we setup a beforeEach and an afterEach method. The `beforeEach` and `afterEach` methods will run before each `it` test. This is to keep our test environment completely clean between each test. 

Then, we create our `describe` block. Describe blocks are usually named to describe a class, a method, or a function. It’s kind of flexible. You can nest describe blocks inside of describe blocks. Describe blocks take two arguments: a string describing what you’re testing, and then a callback function. 

Inside that callback function, you nest `it` blocks which test specific behavior of whatever your “described” given a certain set of conditions. 

`it` takes the same arguments as `describe`: a string description and then a function, but the `it` function takes a `done` callback that must be called when the function is done, or else your test will fail for taking too long. 

Now, let’s run `mocha ./test/` and see what happens. 
```
> $ mocha ./test/                                                                                                                                                                                                                                                                                                                                                 ⬡ 7.10.1

  #tokenAPI
    ✓ should return the price of the token

  1 passing (7ms)
```

Cool, so now we have our tests wired up, we can start actually expecting some different stuff to happen, and then we get into a red-green-refactor cycle with our tests. 

4. Fill our test out
Let’s edit our test to make some actual assertions.
We’re going to call `tokenAPI(‘BTC’)` and then in our callback function, we’re going to setup our expectations. 

```
 describe('#tokenAPI', function () {
   it('should return the price of the token', function (done) {
     tokenAPI('BTC', function (err, price) {
       console.log(err, price);
       expect(err).to.be(null);
       expect(price).to.be.a('Number');
       expect(price).to.be.ok;
       done();
     });
   });
 });
```

Edit our package.json `test` script to be 
```
   "scripts": {
     "test": "mocha ./test"
   },
```
This will tell `npm run test` to run `mocha ./test` which will run our test suite.

Now, if we run `npm run test` we should see a failure. 

```
> $ npm run test                                                                                                                                                                                                                                                                                                                                                  ⬡ 7.10.1

> my-lib@1.0.0 test /Users/dylanlott/Development/my-lib
> mocha ./test

  #adder
called
    1) should add two numbers

  0 passing (2s)
  1 failing
```

This is good! You’ve got the “red” part of red-green-refactor down.

Let’s write our actual library now. We know what we want our API to look like, we have our test ready to verify, now we just have to get our tests passing and we can push. 

Based on the first part of this, we want our default export of our library to be a function. Let’s setup this structure in the index. 

```
module.exports = function () {
  
}
```

After this, we know we need it to take two arguments, and return the sum of those two arguments. 

```
module.exports = function (num1, num2) {
  return (num1 + num2)
}
```
> _**I said it was gonna be simple**_ 
 
# Publishing to NPM

In your terminal, run `npm login`

This will ask you for your username and password. Enter those and login. 

Then, you can run `npm publish` and it will push your library up to npm! 

There you go, your package is published!

Check it out on npm by directing your browser to https://npmjs.com/packages/<your-package-name>

The package name can be found in the `package.json` This is where npm will push the package to on their repository.

## Updating your package
Run `npm version <type>` and it will automatically increment the type of version update you made. 

In order, the versions are major, minor, and patch. npm follows semantic versioning, which you can read more about [here](https://docs.npmjs.com/getting-started/semantic-versioning)

- Patch, bug fix, or other small changes: increment the last number. 
- Adding features that don’t break currently implemented features: minor version. Bump the middle number by one. 
- Adding backward-incompatible code or breaking features: major version. Bump the first number by one. 

### .npmignore
You can use an `.npmignore` file to do the same thing as a `.gitignore`. It’ll allow you to select which files you want published and which ones you want kept out of the npm repository.

## Tagging a release
By default, npm publishes with the `latest` tag. But if you specify the `publish` command with the `--tag` flag, then you can specify a different tag. 

For example `npm publish --tag beta`  will allow you to publish a version that can only be installed with `npm install <package>@<tag>` 

For example for this tutorial, this would be `npm install my-lib@beta` 

# Spruce up your Repo

### Add a README
Add a `README.md` file to the root of your project and this will show up on the page of both your GitHub and your package's NPM page.

Include some documentation on your library, add sources, specify the license, etc...

Add some badges to your README. 
[ForTheBadge](https://forthebadge.com/)

# More Resources 

If you want a quick starter template for a library, you can fork and clone a boilerplate.

This boilerplate is simple, gets the job done, and has some nice npm scripts setup for testing (Mocha), code coverage (Istanbul), and releasing packages.
[GitHub - DavidWells/js-library-starter-kit: JavaScript library starter kit for open source projects](https://github.com/DavidWells/js-library-starter-kit)

This boilerplate is more advanced, builds with Webpack, has eslint, mocha for tests, and gives you access to ES6 JavaScript features with Babel.

[GitHub - krasimir/webpack-library-starter: Webpack based boilerplate for producing libraries (Input: ES6, Output: universal library)](https://github.com/krasimir/webpack-library-starter)

[npm Documentation](https://docs.npmjs.com/)

Semantic versioning: [13 - Semantic versioning and npm | npm Documentation](https://docs.npmjs.com/getting-started/semantic-versioning) 
