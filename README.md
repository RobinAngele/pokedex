# 🎮 Pokédex

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![REST API](https://img.shields.io/badge/REST_API-FF6C37?style=flat&logo=postman&logoColor=white)

An interactive Pokédex web app fetching live Pokémon data from the [PokéAPI](https://pokeapi.co/). Search, browse, and explore hundreds of Pokémon with a responsive, card-based UI.

## ✨ Features

- 🔍 **Live Search** — search any Pokémon by name with real-time suggestions
- 🃏 **Card Layout** — each Pokémon displayed as a visual card (name, image, type)
- 📱 **Fully Responsive** — works on mobile, tablet and desktop
- ⏳ **Loading Animation** — custom Pokéball spinner while fetching data
- 🧩 **Modular JS** — clean separation: API calls, rendering, utilities

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Data | [PokéAPI](https://pokeapi.co/) (REST) |
| Logic | Vanilla JavaScript (ES6+) |
| Styling | CSS3 with responsive media queries |
| Markup | HTML5 |

## 📁 Project Structure

```
├── css/
│   ├── style.css           # Main styles
│   ├── pokemon-cards.css   # Pokémon card styles
│   └── responsive.css      # Media queries
├── js/
│   ├── app.js              # App initialization
│   ├── api.js              # PokéAPI interaction
│   ├── render.js           # Card rendering
│   └── utils.js            # Helper functions
├── assets/
│   ├── fonts/              # Custom fonts
│   └── icons/              # Icons & favicon
├── index.html              # Entry point
└── README.md
```

## 🚀 Quick Start

```bash
git clone https://github.com/RobinAngele/pokedex.git
cd pokedex
# Open index.html in your browser — no build step needed!
```

Or serve locally:
```bash
npx serve .
```

---

> Built as a front-end portfolio project. PRs and suggestions welcome!
