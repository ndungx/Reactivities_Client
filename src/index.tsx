import ReactDOM from 'react-dom';
import App from './app/layouts/App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import ScrollToTop from './app/layouts/ScrollToTop';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        background-color: rgb(234, 234, 234) !important;
    }
`

ReactDOM.render(
    <BrowserRouter>
        <ScrollToTop>
            <GlobalStyle />
            <App />
        </ScrollToTop>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
