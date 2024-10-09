# `whoami`

```js
const christophe = {
  family: { wife: "👩🏻‍🦰 Élodie", sons: ["👦🏻 Maxence", "👦🏻 Elliott"] },
  city: "Paris, FR",
  company: {
    name: "Doctolib",
    hiring: true,
    superCool: true
  },
  webDevSince: 1995,
  mightBeKnownFor: [
    "Prototype.js",
    "Prototype and Script.aculo.us (“The Bungie Book”)",
    "dotJS",
    "Paris Web",
    "NodeSchool Paris",
  ],
};
```

---

# Un mot sur <img src="/logo-doctolib.png" alt="Doctolib" style="height: 1em; margin: 0; padding: 0; display: inline; vertical-align: baseline" />…

[Doctolib](https://www.doctolib.fr/) est **la plus grande entreprise technologique de santé en Europe**.

Nous fournissons un « OS » **haut de gamme** de services et outils pour les **équipes de soin et les patients** dans plusieurs pays.

Deux cœurs de mission :

- **Améliorer le quotidien des soignants**
- **Aider les patients à être en meilleure santé**

**700+ devs** et contributeurs techniques au sein 2 800+ Doctolibers. Super culture.

Stack technique : Ruby / Rails, Java / Spring Boot, React / TypeScript, PostgreSQL, MongoDB, AWS…

Bureaux à Paris (QG), **Nantes** 👀, Niort, Berlin et Milan, politiques de travail hybride sympa.

On a toujours besoin de profils tech ! Jetez donc un coup d'œil à notre [page Carrières](https://careers.doctolib.com/tech-doctolib/) !

---

# Cette présentation est interactive

- <kbd>o</kbd> pour un survol
- <kbd>d</kbd> pour basculer le mode sombre
- <kbd>f</kbd> pour le plein écran
- <kbd>g</kbd> pour atteindre n'importe qulle diapo par numéro ou fragment de titre
- Survolez le coin inférieur gauche pour la barre d'outils

---
layout: cover
background: /covers/ayo-ogunseinde-sibVwORYqs0-unsplash.jpg
---

# JavaScript ou ECMAScript ?!

ECMA, TC39, ECMAScript et JavaScript

---

# ECMA et TC39

**ECMA** est un organisme international de standardisation<br/>
(comme ISO, IETF, W3C ou le WHATWG, par exemple)

**ES = ECMAScript**. Le standard officiel pour JavaScript\*

**TC39** = Technical Committee 39. Le comité de pilotage de plusieurs standards :
ECMAScript (ECMA-262), `Intl` (ECMA-402), JSON (ECMA-404), etc.

<Footnote>

Car « JavaScript » est une marque déposée de… Oracle Corp. Je sais. 🤢 [Signez la pétition](https://javascript.tm/).

</Footnote>

---

# Comment le TC39 fait-il avancer JavaScript ?

Réunions bimestrielles (à distance, en présentiel ou en hybride)

**Versions annuelles :** on gèle le périmètre en janvier ou mars, sortie officielle en juin.

« ES6 » = ES2015, « ES7 » = ES2016, et maintenant on dit ES2024, etc.

Tout ça est parfaitement [transparent et public](https://github.com/tc39).

---

# Les [**6 stades**](https://tc39.github.io/process-document/) du ~~deuil~~ processus TC39

<table>
  <thead>
    <tr>
      <th>Stade</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr v-click>
      <th><strong>0 Strawman</strong></th>
      <td>« Hé, si on avait un opérateur licorne (🦄) ça serait hénaurme™… »</td>
    </tr>
    <tr v-click>
      <th><strong>1 Proposal</strong></th>
      <td>Un membre du TC39 devient le « champion » de la proposition.  L'API générale est définie et la plupart des impacts croisés sont traités.</td>
    </tr>
    <tr v-click>
      <th><strong>2 Draft</strong></th>
      <td>Le <em>Spec Text</em> initial est fait, qui couvre tous les aspects critiques et la sémantique technique.</td>
    </tr>
    <tr v-click>
      <th><strong>2.7 Draft+</strong></th>
      <td>La spec et l'API sont finalisées, révisées et approuvées. Tous les cas à la marge sont traités.</td>
    </tr>
    <tr v-click>
      <th><strong>3 Candidate</strong></th>
      <td>Couverture Test262 intégrale</td>
    </tr>
    <tr v-click>
      <th><strong>4 Finished</strong></th>
      <td>2+ implémentations natives (souvent v8 et Spidermonkey), retour d'expérience important, et le <em>Spec Editor</em> a signé. Sera dans le prochain gel (janvier / mars) pour version officielle (juin).</td>
    </tr>
  </tbody>
</table>
