---
layout: cover
background: /covers/aaron-burden-CKlHKtCJZKk-unsplash.jpg
---

# Rappels rapides :<br/>ES2020–2023

Une liste choisie de trucs que trop peu de gens ont vu passer 😉

---

# ES2020 : `String#matchAll`

Capture **tous les groupes** pour une regex *sticky* ou **globale**.

```js
const text = 'Get in touch at tel:0983450176 or sms:478-555-1234'

text.match(/(?<protocol>[a-z]{3}):(?<number>[\d-]+)/g)
// => ['tel:0983450176', 'sms:478-555-1234'] -- 😞 HÉ MEC, ILS SONT OÙ MES GROUPES ?!
```

```js
Array.from(text.matchAll(/([a-z]{3}):([\d-]+)/g)).map(
  ([, protocol, number]) => ({ protocol, number })
)
// => [{ number: '0983450176', protocol: 'tel' }, { number: '478-555-1234', protocol: 'sms' }]

Array.from(text.matchAll(/(?<protocol>[a-z]{3}):(?<number>[\d-]+)/g)).map((mr) => mr.groups)
// => [{ number: '0983450176', protocol: 'tel' }, { number: '478-555-1234', protocol: 'sms' }]
```

---

# ES2020 / ES2021 : `Promise.allSettled`/`any`

Les deux combinateurs manquants : `any` court-circuite sur le **premier accomplissement**, tandis que `allSettled` ne court-circuite jamais : on a tous les établissements pour analyse.

Avec `all` (court-circuite sur le premier rejet) et `race` (court-circuite sur le premier établissement) depuis ES2015, on couvre désormais tous les scénarios.

```js
// Que le plus rapide gagne !
const data = await Promise.any([fetchFromDB(), fetchFromCache(), fetchFromHighSpeedLAN()])

// Parallélise les tests, sans court-circuit !
await Promise.allSettled(tests)
// => [
//   { status: 'fulfilled', value: Response… },
//   { status: 'fulfilled', value: undefined },
//   { status: 'rejected', reason: Error: snapshot… }
// ]
```

---

# ES2022 : `at()` sur itérables natifs indexés 🤩

Tu sais sans doute que `Array` et `String` permettent des indices négatifs dans `slice`, `splice`, etc. mais pas dans `[…]` ? Tu peux désormais choper les derniers éléments sans grimacer.

Désormais, **tous les itérables natifs indexés** proposent `.at(…)` qui autorise les indices négatifs !

```js
const roomSeries = ['Jules Verne', 'Titan', 'Belem', 'Tour Bretagne', /* … */ 'Hangar', 'L’Atelier']
roomSeries.at(-1) // => 'L’Atelier'
roomSeries.at(-2) // => 'Hangar'
```

---

# ES2023 : Modif de tableau par copie

Une série d'utilitaires sympa qui nous permettent de dériver des tableaux (immutabilité FTW). L’API de `Array` exposait jusqu'ici 8 méthodes dérivatives (produisant un nouveau tableau) et 9 mutatives (modifiant le tableau en place), y compris `reverse()` et `sort()`, qu'on pensait souvent dérivatives !

```js
const trackSpeakers = ['Etienne', 'Mathieu', 'Tristan', /* … */ 'Olivier', 'Alexis', 'Eric']

trackSpeakers.toReversed()
// => ['Eric', 'Alexis', 'Olivier' … 'Tristan', 'Mathieu', 'Etienne']
trackSpeakers.toSorted((s1, s2) => s1.localeCompare(s2))
// => ['Alexis', 'David', 'Eric', 'Etienne' … 'Tristan']
trackSpeakers.toSpliced(-2, 2)
// => ['Alexis', 'Eric']
trackSpeakers.with(-2, 'Yann')
// => ['Etienne', 'Mathieu', 'Tristan' … 'Olivier', 'Yann', 'Eric']

trackSpeakers // => ['Etienne', 'Mathieu', 'Tristan' … 'Olivier', 'Alexis', 'Eric']
```
