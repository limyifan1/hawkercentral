import React from "react";

export const languages = {
  en: "en",
  zh: "zh",
};

// const { Provider, Consumer } = React.createContext();

// class LanguageContextProvider extends Component {
//   state = {
//     language: languages.en, // default value
//     toggleLanguage: () => {},
//   };

//   render() {
//     return (
//       <Provider
//         value={this.state}
//       >
//       </Provider>
//     );
//   }
// }

// class LanguageContextConsumer extends Component {
//   state = {
//     language: languages.en, // default value
//     toggleLanguage: () => {},
//   };

//   render() {
//     return (
//       <Consumer
//         value={this.state}
//       >
//       </Consumer>
//     );
//   }
// }

// export { LanguageContextProvider, LanguageContextConsumer };

export const LanguageContext = React.createContext({
  language: languages.en, // default value
  toggleLanguage: () => {},
});

export const CartContext = React.createContext({
  cartProducts: [],
  cartTotal: {
    productQuantity: 0,
    totalPrice: 0,
  },
  addProduct: () => {},
});

// const { Provider, Consumer } = React.createContext();

// class ThemeContextProvider extends Component {
//   state = {
//     language: "Day"
//   };

//   toggleLanguage = () => {
//     this.setState(prevState => {
//       return {
//         language: prevState.language === "en" ? "zh" : "en"
//       };
//     });
//   };

//   render() {
//     return (
//       <Provider
//         value={{ language: this.state.language, toggleLanguage: this.toggleLanguage }}
//       >
//         {this.props.children}
//       </Provider>
//     );
//   }
// }

// export { ThemeContextProvider, Consumer as ThemeContextConsumer };
