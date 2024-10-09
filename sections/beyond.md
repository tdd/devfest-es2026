---
layout: cover
background: /covers/jan-tinneberg-tVIv23vcuz4-unsplash.jpg
---

# ES2025 and beyond

<!--
TODO TRACK ONGOING TC39 MEETING
Latest meeting: Oct 8-10 2024 in Tokyo
-> Temporal: anything happens?
-> Structs moving to stage 2?
-->

---

# E2025: Collection / iterator utilities

We're not going to stop processing data collections (and iterables in general) anytime soon, so we might as well have more tools in our standard toolbelt for this…

We're about to get many [**new `Set` methods**](https://github.com/tc39/proposal-set-methods#readme) (intersection, union, difference, disjunction, super/subset, etc.) and a ton of [**iterator helpers**](https://github.com/tc39/proposal-iterator-helpers#readme) (instead of having to roll our own generative functions for `take`, `filter` or `map`, for instance).

```js
function* fibonacci() { /* … */ }

const firstTens = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const fibs = new Set(fibonacci().take(10))
const earlyFibs = firstTens.intersection(fibonacci) // => Set { 1, 2, 3, 5, 8 }
const earlyNonFibs = firstTens.difference(fibonacci) // => Set { 4, 6, 7, 9, 10 }
const evenFibs = earlyFibs.values().filter((n) => n % 2 === 0)
```

<Footnote>

Asynchronous versions are in the pipeline too, at stage 2 right now (February 2024).

</Footnote>

---

# ES2025: More flexible regexes

Named capture groups are a major readability / maintainability boost for regexes, but an oversight in their initial spec prevented using the same group in multiple parts of an alternative.

It should have been ready for ES2023 but lacked some tests and a second native implementation.  Tests are done now and we're waiting for either v8 or Spidermonkey to jump the gun: this will very likely be part of ES2024.

Regexp modifiers, which let you locally change regexp flags within your expression, also just (Oct 8, 2024) made it to stage 4!

```js
const year = dateText.match(/(?<year>[0-9]{4})-[0-9]{2}|[0-9]{2}-(?<year>[0-9]{4})/)?.groups.year

const mixedAlpha = /^[a-z](?-i:[a-z])$/i
mixedAlpha.test('ab') // => true
mixedAlpha.test('Ab') // => true
mixedAlpha.test('aB') // => false
```

---

# ES2025: Import attributes and JSON modules

Provides free-form metadata on imports, with an inline syntax.

The dominating use case, long discussed, is extra module types with matching type expectations for security reasons (a bit like HTTP's `X-Content-Type-Options: nosniff` response header).  We then use the `type` metadata, leveraged by engines.

```js
// Static imports
import config from '../config/config.json' with { type: 'json' }

// Dynamic imports
const { default: config } = await import('../config/config.json', { with: { type: 'json' } })
```

The spec suggests matching upgrades for Web Worker instantiation and HTML's `script` tag.

<Footnote>

This proposal supersedes the same-stage *JSON Modules* proposal, that used a more specific `assert` syntax.

</Footnote>

---

# ES2025: `Promise.try()`

A faster alternative to the usual `Promise.resolve().then(f)` or `new Promise((resolve) => resolve(f()))` shenanigans for allowing promise-based consumer semantics over a function that may be sync or async.

Ensures same-tick execution when synchronous whilst being a lot more ergonomic!

```js
// `init` is a value-returning function that may be sync or promise-based async
async function runProcess({ init... }) {
  const initial = await Promise.try(init)
  // ...
}
```

---

# E2025? `Array.fromAsync(…)` <span class="stage">stage 3</span>
<!-- May 23 -->

We've had `Array.from(…)` since ES2015, that consumes any **synchronous iterable** to turn it into an actual array.

We'll likely get `Array.fromAsync(…)`, that does the same thing with **async iterables**.

```js
// Reads all STDIN (readable stream) lines into an array
process.stdin.setEncoding('utf-8')
const inputLines = await Array.fromAsync(process.stdin)
```

```js
// Let's remove trailing whitespace / LF / CR, while we're at it
process.stdin.setEncoding('utf-8')
const inputLines = await Array.fromAsync(process.stdin, (line) => line.trimEnd())
```

---

# ES2025? Guaranteed resource cleanup <span class="stage">stage 3</span>
<!-- March 23 -->

Finally a mechanism to guarantee resource disposal!

Quite like C#'s `using`, Python's `with` or Java's try-with-resources: disposes of the resource in a guaranteed way when the scope or closure is discarded.

Exists in synchronous and asynchronous variants.  Based on two new well-known symbols (`Symbol.dispose` and `Symbol.asyncDispose`), supported out-of-the-box by timers and streams.

```js
async function copy4K(s1, s2) {
  using f1 = await fs.promises.open(s1, constants.O_RDONLY),
        f2 = await fs.promises.open(s2, constants.O_WRONLY)

  const buffer = Buffer.alloc(4096)
  const { bytesRead } = await f1.read(buffer)
  await f2.write(buffer, 0, bytesRead)
} // 'f2' is disposed first, then 'f1' is disposed second
```

<Footnote>

Proposal's name: *Explicit Resource Management*. TypeScript 5.2+ and Babel 7.22+ support it. Early implementations in Node.js (e.g. Timers).

</Footnote>

---

# ES2025? Temporal 🥳 <span class="stage">stage 3</span>
<!-- Jul 24 -->

Advantageously replaces Moment, Luxon, date-fns, etc. We already have `Intl` for formatting, but we're upping our game here. Immutable-style API, nanosecond precision, all TZ supported, distinguishes absolute and local time, duration vs. interval, etc.  **Awesome!** Check out the [docs](https://tc39.es/proposal-temporal/docs/), [cookbook](https://tc39.es/proposal-temporal/docs/cookbook.html)…

```js
const meeting1 = Temporal.Date.from('2020-01-01')
const meeting2 = Temporal.Date.from('2020-04-01')
const time = Temporal.Time.from('10:00:00')
const timeZone = new Temporal.TimeZone('America/Montreal')
timeZone.getAbsoluteFor(meeting1.withTime(time)) // => 2020-01-01T15:00:00.000Z
timeZone.getAbsoluteFor(meeting2.withTime(time)) // => 2020-01-01T14:00:00.000Z
```

<v-click>

```js
const departure = Temporal.ZonedDateTime.from('2020-03-08T11:55:00+08:00[Asia/Hong_Kong]');
const arrival = Temporal.ZonedDateTime.from('2020-03-08T09:50:00-07:00[America/Los_Angeles]');
departure.until(arrival).toString() // => 'PT12H55M'

const flightTime = Temporal.Duration.from({ hours: 14, minutes: 10 }); // { minutes: 850 } works too
const parisArrival = departure.add(flightTime).withTimeZone('Europe/Paris');
parisArrival.toString() // => '2020-03-08T19:05:00+01:00[Europe/Paris]')
```

</v-click>

---

# ES2025? `RegExp.escape()` <span class="stage">stage 3</span>
<!-- Jul 24 -->

We **finally** get native regular expression escaping:

```js
RegExp.escape("😊 *_* +_+ ... 👍");
// => "😊\\ \\*_\\*\\ \\+_\\+\\ \\.\\.\\.\\ 👍"
```

---

# ES2025? Decorators <span class="stage">stage 3</span>
<!-- March 23 / May 23 -->

<!-- Certes, ça ne concerne que les gens qui font beaucoup de POO, et si la tendance  est à la baisse en JS, de nombreux frameworks importants l'utilisent énormément (mais du coup, ils ont tendance à le faire en TypeScript). -->

This takes **forever**…  Went through a few false-starts, then we had to wrap the test suite, and now we're waiting for native implementations.  The spec is done, anyway, and TypeScript aligns with it.  This is a great way of doing AOP *(as are ES proxies, by the way)*.  The language provides the plumbing, and the community provides the actual decorators.

```js
class SuperWidget extends Component {
  @deprecate
  deauth() { … }

  @memoize('1m')
  userFullName() { … }

  @autobind
  logOut() {
    this.#oauthToken = null
  }

  @override
  render() { … }
}
```

---

# ES2025? Shadow Realms <span class="stage">stage "2.7"</span>
<!-- Feb 24 -->

This provides the building blocks for having full control of **sandboxed JS evaluation** (among other things, you can customize available globals and standard library elements).

This is a **godsend** for web-based IDEs, DOM virtualisation, test frameworks, server-side rendering, secure end-user scripts, and more!

```js
const realm = new ShadowRealm()

const process = await realm.importValue('./utils/processor.js', 'process')
const processedData = process(data)

// True isolation!
globalThis.userLocation = 'Freiburg'
realm.evaluate('globalThis.userLocation = "Paris"')
globalThis.userLocation // => 'Freiburg'
```

Check out [this explainer](https://github.com/tc39/proposal-shadowrealm/blob/main/explainer.md) for full details.

---

# `Iterator.range` 🤩 <span class="stage">stage 2</span>
<!-- Apr 24 -->

Finally an arithmetic sequence generator!  Coupled with iterator helpers, it's just too good…

```js
Iterator.range(0, 5).toArray()
// => [0, 1, 2, 3, 4]

Iterator.range(1, 10, 2).toArray()
// => [1, 3, 5, 7, 9]

Iterator.range(1, 7, { step: 3, inclusive: true })
  .map((n) => '*'.repeat(n))
  .toArray()
// => ['*', '****', '*******']
```

Go have fun in the [playground!](https://tc39.es/proposal-iterator.range/playground.html)

---

# Records &amp; Tuples: Immutability FTW 💖 <span class="stage">stage 2</span>
<!-- Apr 24 -->

Deep, native immutable objects (records) and arrays (tuples).  We get all the benefits of immutability (e.g. referential equality), and it helps promote functional programming in JS.

All the usual operators and APIs work (`in`, `Object.keys()`, `Object.is()`, `===`, etc.), and this plays nicely with the standard library.  You can easily convert from mutable versions using factories.  Cherry-on-top: `JSON.parseImmutable()`!

```js
// Records
const grace1 = #{ given: 'Grace', family: 'Hopper' }
const grace2 = #{ given: 'Grace', family: 'Kelly' }
const grace3 = #{ ...grace2, family: 'Hopper' }
grace1 === grace3 // => true!
Object.keys(grace1) // => ['family', 'given'] -- sorted!

// Tuples
#[1, 2, 3] === #[1, 2, 3] // => true!
```

<Footnote>

Have fun with the [tutorial](https://tc39.es/proposal-record-tuple/tutorial/), sweet [playground](https://rickbutton.github.io/record-tuple-playground/#eyJjb250ZW50IjoiLy8gU2FsdXQgbCdhdWRpdG9pcmUgZGUgUml2aWVyYURFViAhXG5cbi8vIFJlY29yZHNcbmNvbnN0IGdyYWNlMSA9ICN7IGdpdmVuOiAnR3JhY2UnLCBmYW1pbHk6ICdIb3BwZXInIH1cbmNvbnN0IGdyYWNlMiA9ICN7IGdpdmVuOiAnR3JhY2UnLCBmYW1pbHk6ICdLZWxseScgfVxuY29uc3QgZ3JhY2UzID0gI3sgLi4uZ3JhY2UyLCBmYW1pbHk6ICdIb3BwZXInIH1cblxuZ3JhY2UxID09PSBncmFjZTMgLy8gPT4gdHJ1ZSFcbk9iamVjdC5rZXlzKGdyYWNlMSkgLy8gPT4gWydmYW1pbHknLCAnZ2l2ZW4nXSAtLSBzb3J0ZWQhXG5cbi8vIFR1cGxlc1xuI1sxLCAyLCAzXSA9PT0gI1sxLCAyLCAzXSAvLyA9PiB0cnVlISIsInN5bnRheCI6Imhhc2giLCJkb21Nb2RlIjpmYWxzZX0=) and amazing [cookbook](https://tc39.es/proposal-record-tuple/cookbook/)!

</Footnote>

---

# Native signals! 📣 <span class="stage">stage 1</span>
<!-- Apr 24 -->

Interoperable, performant, DevTools-exposed signals for you.

```js
// "Atom"
const counter = new Signal.State(0)
// Computed values
const isEven = new Signal.Computed(() => (counter.get() & 1) === 0)
const parity = new Signal.Computed(() => isEven.get() ? "even" : "odd")

// A library or framework would define effects based on other Signal primitives,
// likely defined in the Signal.subtle namespace, such as Watcher.
declare function effect(cb: () => void): (() => void)

effect(() => element.textContent = parity.get())

// Let's simulate external updates to counter...
setInterval(() => counter.set(counter.get() + 1), 1000)
```

<!--
LATER UPDATE CANDIDATES (NEEDS FORWARD MOVES AT TC39)

Async Context (S2, Apr 24) - https://github.com/tc39/proposal-async-context
-> Awesome and very useful but too technical for this prez

Error.isError (S2, Jun 24) - https://github.com/tc39/proposal-is-error
-> Too minute

ESM Phase Imports (S2, Jun 24) - https://github.com/tc39/proposal-esm-phase-imports
-> Too technical 

"Discard" (void) bindings (S2, Jun 24) - https://github.com/tc39/proposal-discard-binding
-> Cool but too minute

Structs, Shared Structs, Mutexes and Unsafe blocks (S2, Oct 24) - https://github.com/tc39/proposal-structs
-> Too technical (mostly shared-memory parallel work)

Concurrency Control (S1, Jul 24) - https://github.com/tc39/proposal-concurrency-control
-> Too early on the API design / semantics, too many open questions yet

Unordered Async Iterator Helpers (S1, Jul 24) - https://github.com/tc39/proposal-unordered-async-iterator-helpers
-> Too early on the API design / semantics, too many open questions yet
-->
