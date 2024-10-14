---
layout: cover
background: /covers/jan-tinneberg-tVIv23vcuz4-unsplash.jpg
---

# ES2025 et au-delà

Déjà beaucoup de choses finalisées, et plein d'autres pourraient arriver d'ici janvier / mars prochain…

<!--
TODO TRACK ONGOING TC39 MEETING
Latest meeting: Oct 8-10 2024 in Tokyo
-> Temporal: anything happens?
-> Structs moving to stage 2?
-->

---

# E2025 : Utilitaires sur collections / itérateurs
<!-- Oct 8 -->

C'est pas demain la veille qu'on arrêtera de traiter des collections (et des itérables en général), alors autant enrichir notre boîte à outils…

Tu vas voir débarquer plein de [**nouvelles méthodes sur `Set`**](https://github.com/tc39/proposal-set-methods#readme) (intersection, union, différence, disjonction, sur-/sous-ensemble, etc.) et une tonne d’[**utilitaires sur itérateurs**](https://github.com/tc39/proposal-iterator-helpers#readme) (plutôt que d'avoir à se faire nos propres fonctions génératives pour `take`, `filter` ou `map`, par exemple).

```js
function* fibonacci() { /* … */ }

const firstTens = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
const fibs = new Set(fibonacci().take(10))
const earlyFibs = firstTens.intersection(fibonacci) // => Set { 1, 2, 3, 5, 8 }
const earlyNonFibs = firstTens.difference(fibonacci) // => Set { 4, 6, 7, 9, 10 }
const evenFibs = earlyFibs.values().filter((n) => n % 2 === 0)
```

<Footnote>

Les versions pour itérateurs asynchrones arrivent aussi, elles sont au stade 2 là tout de suite (octobre 2024).

</Footnote>

---

# ES2025 : des regex plus flexibles
<!-- Oct 8 -->

Les **groupes de capture nommés** ont fait beaucoup pour la lisibilité / maintenabilité des regex, mais leur spec initiale a loupé une marche, empêchant la **réutilisation d'un nom de groupe** de part et d'autre d'une alternative.

Ça aurait dû débarquer dans ES2023, mais il manquait des tests et une 2e implémentation native. Les tests sont arrivés à temps pour le gel 2024, mais l'implémentation a loupé le coche de quelques mois. Mais ayé !

Tu as aussi les **modificateurs de regex**, qui permettent de changer les drapeaux sur une portion de l'expression.  Stade 4 tout frais (8 octobre 2024) !

```js
const year = dateText.match(/(?<year>[0-9]{4})-[0-9]{2}|[0-9]{2}-(?<year>[0-9]{4})/)?.groups.year

const mixedAlpha = /^[a-z](?-i:[a-z])$/i
mixedAlpha.test('ab') // => true
mixedAlpha.test('Ab') // => true
mixedAlpha.test('aB') // => false
```

---

# ES2025 : Attributs d'import et modules JSON
<!-- Oct 8 -->

Permet la fourniture de métadonnées libres sur les imports, au travers d'une syntaxe à la volée.

Le cas ultra-dominant, discuté de longue date, concerne les types complémentaires de modules et leur validation pour raisons de sécurité (un peu comme l'en-tête de réponse HTTP `X-Content-Type-Options: nosniff`).  On utilise alors la métadonnée `type`, gérée par les moteurs.

```js
// Imports statiques
import config from '../config/config.json' with { type: 'json' }

// Imports dynamiques
const { default: config } = await import('../config/config.json', { with: { type: 'json' } })
```

La spec encourage l'implémentation de mises à jour équivalentes pour l'instantiation de Web Workers et la balise HTML `<script>`.

<Footnote>

Cette proposition remplace l'historique *JSON Modules*, qui utilisait un syntaxe `assert` plus spécifique.

</Footnote>

---

# ES2025 : `Promise.try()`
<!-- Oct 9 -->

C'est une alternative plus rapide aux bidouilles classiques `Promise.resolve().then(f)` ou `new Promise((resolve) => resolve(f()))`, afin d'appliquer la sémantique de consommation de promesse à une fonction qu'elle soit synchrone ou asynchrone.

Garantit une exécution **« dans le même tick »** des fonctions synchrones, tout en étant plus ergonomique !

```js
// `init` est une fonction renvoyant une valeur, et peut être synchrone ou asynchrone basée promesse.
async function runProcess({ init... }) {
  const initial = await Promise.try(init)
  // ...
}
```

---

# E2025 ? `Array.fromAsync(…)` <span class="stage">stade 3</span>
<!-- May 23 -->

Tu as `Array.from(…)` depuis ES2015, qui consomme n'importe quel **itérable synchrone** pour en faire un véritable tableau.

Tu auras prochainement `Array.fromAsync(…)`, qui fait pareil pour les **itérables asynchrones**.

```js
// Lit toutes les lignes de STDIN (flux en lecture) pour en faire un tableau
process.stdin.setEncoding('utf-8')
const inputLines = await Array.fromAsync(process.stdin)
```

```js
// Virons l'espacement de fin de ligne tant qu'on y est
process.stdin.setEncoding('utf-8')
const inputLines = await Array.fromAsync(process.stdin, (line) => line.trimEnd())
```

---

# ES2025 ? Ressources garanties libérées <span class="stage">stade 3</span>
<!-- March 23 -->

Enfin un mécanisme pour garantir la libération des ressources !

Similaire au `using` de C#, au `with` de Python ou au *try-with-resources* de Java : nettoie les ressources de façon garantie quand la portée / fermeture lexicale disparaît.

Existe en modes synchrone et asynchrone.  Basé sur deux nouveaux symboles prédéfinis (`Symbol.dispose` et `Symbol.asyncDispose`), pris en charge d'entrée de jeu par les timers et les flux.

```js
async function copy4K(s1, s2) {
  using f1 = await fs.promises.open(s1, constants.O_RDONLY),
        f2 = await fs.promises.open(s2, constants.O_WRONLY)

  const buffer = Buffer.alloc(4096)
  const { bytesRead } = await f1.read(buffer)
  await f2.write(buffer, 0, bytesRead)
} // 'f2' est libéré d'abord, 'f1' est libéré ensuite
```

<Footnote>

La proposition s'appelle *Explicit Resource Management*. TypeScript 5.2+ et Babel 7.22+ la gèrent. Node.js l'implémente déjà en partie (timers et flux Node).

</Footnote>

---

# ES2025 ? Temporal 🥳 <span class="stage">stade 3</span>
<!-- last discussed Oct 24 -->

Tellement hâte de dire au revoir à Moment, Luxon, date-fns, dayjs, etc. `Intl` nous fournit déjà le formatage avancé, mais ici on a tous les calculs. API dérivative, précision à la nanoseconde, toutes les TZ, distingo temps absolu / local, durée vs. intervalle, etc.  **Fabuleux !** Va voir les [docs](https://tc39.es/proposal-temporal/docs/), le [cookbook](https://tc39.es/proposal-temporal/docs/cookbook.html)…

```js {1|1-3|2,4-5|3-4,6|none}
const time = Temporal.PlainTime.from('10:00:00')
const meeting1 = Temporal.PlainDateTime.from('2024-01-01').withPlainTime(time)
const meeting2 = Temporal.PlainDateTime.from('2024-04-01').withPlainTime(time)
const timeZone = 'Europe/Paris'
meeting1.toZonedDateTime(timeZone).toInstant() // => 2024-01-01T09:00:00Z
meeting2.toZonedDateTime(timeZone).toInstant() // => 2024-04-01T08:00:00Z
```

<v-click at="-1">

```js {none|1-2|1-3|5|1,5-7}
const departure = Temporal.ZonedDateTime.from('2020-03-08T11:55:00+08:00[Asia/Hong_Kong]')
const arrival = Temporal.ZonedDateTime.from('2020-03-08T09:50:00-07:00[America/Los_Angeles]')
departure.until(arrival).toString() // => 'PT12H55M'

const flightTime = Temporal.Duration.from({ hours: 14, minutes: 10 }) // ou { minutes: 850 }
const parisArrival = departure.add(flightTime).withTimeZone('Europe/Paris')
parisArrival.toString() // => '2020-03-08T19:05:00+01:00[Europe/Paris]')
```

</v-click>

---

# ES2025 ? `RegExp.escape()` <span class="stage">stade 3</span>
<!-- Jul 24 -->

Tu vas **enfin** pouvoir échapper nativement les regex :

```js
RegExp.escape("😊 *_* +_+ ... 👍");
// => "😊\\ \\*_\\*\\ \\+_\\+\\ \\.\\.\\.\\ 👍"
```

---

# ES2026 ? Décorateurs <span class="stage">stade 3</span>
<!-- March 23 / May 23 -->

<!-- Certes, ça ne concerne que les gens qui font beaucoup de POO, et si la tendance  est à la baisse en JS, de nombreux frameworks importants l'utilisent énormément (mais du coup, ils ont tendance à le faire en TypeScript). -->

Ça prend **la vie**…  Plusieurs faux-départs, puis il a fallu boucler les tests, on attend maintenant les implémentations natives. La spec est finie, TypeScript est aligné.  Super moyen de faire de l'AOP *(mais les ES proxies c'est top aussi)*.  Le langage fournit la plomberie, et la communauté fournit les décorateurs eux-mêmes.

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

# ES2026 ? Shadow Realms <span class="stage">stade 2.7</span>
<!-- Feb 24 -->

Fournit les briques d'un contrôle total de **l'évaluation sandboxée de JS** (on peut par exemple personnaliser les globales et éléments de bibliothèque standard disponibles).

C'est du **pain bénit** pour les EDI en ligne, la virtualisation du DOM, les frameworks de test, le rendu côté serveur, la sécurisation de scripts utilisateurs, et plus encore !

```js
const realm = new ShadowRealm()

const process = await realm.importValue('./utils/processor.js', 'process')
const processedData = process(data)

// Véritable isolation !
globalThis.userLocation = 'Nantes'
realm.evaluate('globalThis.userLocation = "Paris"')
globalThis.userLocation // => 'Nantes'
```

Jette un coup d'œil à [cette explication](https://github.com/tc39/proposal-shadowrealm/blob/main/explainer.md) pour avoir tous les détails.

---

# ES2026 ? `Iterator.range` 🤩 <span class="stage">stade 2</span>
<!-- Apr 24 -->

Enfin un générateur de séquence arithmétique ! Couplé avec les utilitaires sur itérateurs, ça fait du bien…

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

Va t'amuser dans le [bac à sable !](https://tc39.es/proposal-iterator.range/playground.html)

---

# ES2026 ? Records &amp; Tuples 💖 <span class="stage">stade 2</span>
<!-- Apr 24 -->

**L'immutabilité FTW !** Objets profonds (*records*) et tableaux (*tuples*) nativement immuables. Tous les avantages de l'immutabilité (ex. égalité référentielle), et ça promeut la programmation fonctionnelle en JS.

Tous les opérateurs et API habituels marchent (`in`, `Object.keys()`, `Object.is()`, `===`, etc.), et ça interagit bien avec la bibliothèque standard.  Tu peux aisément dériver les versions mutables grâce à des *factories*.  Cerise sur le gâteau : `JSON.parseImmutable()` !

```js
// Records
const grace1 = #{ given: 'Grace', family: 'Hopper' }
const grace2 = #{ given: 'Grace', family: 'Kelly' }
const grace3 = #{ ...grace2, family: 'Hopper' }
grace1 === grace3 // => true !
Object.keys(grace1) // => ['family', 'given'] -- trié !

// Tuples
#[1, 2, 3] === #[1, 2, 3] // => true !
```

<Footnote>

Va t'amuser sur le [tutoriel](https://tc39.es/proposal-record-tuple/tutorial/), le délicieux [bac à sable](https://rickbutton.github.io/record-tuple-playground/#eyJjb250ZW50IjoiLy8gU2FsdXQgbCdhdWRpdG9pcmUgZGUgUml2aWVyYURFViAhXG5cbi8vIFJlY29yZHNcbmNvbnN0IGdyYWNlMSA9ICN7IGdpdmVuOiAnR3JhY2UnLCBmYW1pbHk6ICdIb3BwZXInIH1cbmNvbnN0IGdyYWNlMiA9ICN7IGdpdmVuOiAnR3JhY2UnLCBmYW1pbHk6ICdLZWxseScgfVxuY29uc3QgZ3JhY2UzID0gI3sgLi4uZ3JhY2UyLCBmYW1pbHk6ICdIb3BwZXInIH1cblxuZ3JhY2UxID09PSBncmFjZTMgLy8gPT4gdHJ1ZSFcbk9iamVjdC5rZXlzKGdyYWNlMSkgLy8gPT4gWydmYW1pbHknLCAnZ2l2ZW4nXSAtLSBzb3J0ZWQhXG5cbi8vIFR1cGxlc1xuI1sxLCAyLCAzXSA9PT0gI1sxLCAyLCAzXSAvLyA9PiB0cnVlISIsInN5bnRheCI6Imhhc2giLCJkb21Nb2RlIjpmYWxzZX0=) et l'extraordinaire [livre de recettes](https://tc39.es/proposal-record-tuple/cookbook/) !

</Footnote>

---

# Signaux 📣 <span class="stage">stade 1</span>
<!-- Apr 24 -->

Des signaux natifs, interopérables, performants, inspectables dans les DevTools… ça t'intéresse ?

```js
// « Atome »
const counter = new Signal.State(0)
// Signaux dérivés / calculés
const isEven = new Signal.Computed(() => (counter.get() & 1) === 0)
const parity = new Signal.Computed(() => isEven.get() ? "even" : "odd")

// Une bibliothèque / un framework pourra définir des effets basés sur d'autres primitives
// de `Signal`, probablement définies dans `Signal.subtle`, telles que `Watcher`.
declare function effect(cb: () => void): (() => void)

effect(() => element.textContent = parity.get())

// Simulons des mises à jour extérieurs du compteur…
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
