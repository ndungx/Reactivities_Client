import ReactDOM from 'react-dom';
import App from './app/layouts/App';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import 'react-toastify/dist/ReactToastify.min.css';
import reportWebVitals from './reportWebVitals';
import ScrollToTop from './app/layouts/ScrollToTop';
import { createGlobalStyle } from 'styled-components';

export const history = createBrowserHistory();

const GlobalStyle = createGlobalStyle`
    body {
        background-color: rgb(234, 234, 234) !important;
    }
`

ReactDOM.render(
    <Router history={history}>
        <ScrollToTop>
            <GlobalStyle />
            <App />
        </ScrollToTop>
    </Router>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
