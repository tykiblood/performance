import Vue from 'vue'
import decode from 'jwt-decode';
import axios from 'axios';
import auth0 from 'auth0-js';
import Router from 'vue-router';
import Auth0Lock from 'auth0-lock';
const ID_TOKEN_KEY = 'id_token';
const ACCESS_TOKEN_KEY = 'access_token';

// Vue.config.debug = process.env.DEBUG_MODE
// Vue.config.client_id = process.env.CLIENT_ID
// Vue.config.client_domain = process.env.CLIENT_DOMAIN
// Vue.config.redirect = process.env.REDIRECT
// Vue.config.scope = process.env.SCOPE
// Vue.config.audience = process.env.AUDIENCE

// const CLIENT_ID = Vue.config.client_id;
// const CLIENT_DOMAIN = Vue.config.client_domain;
// const REDIRECT = Vue.config.redirect;
// const SCOPE = Vue.config.scope;
// const AUDIENCE = Vue.config.audience;

const CLIENT_ID = "zDGXQ7dR6DQ5f2e7k0sWThovX1U82Ey-";
const CLIENT_DOMAIN = "cotopaxi-auth0-reviewapp.auth0.com";
const REDIRECT = "https://recruiters-portal-develo-pr-10.herokuapp.com/callback";
const SCOPE = "full_access";
const AUDIENCE = "https://cotopaxi-auth0-reviewapp.auth0.com/userinfo";

var auth = new auth0.WebAuth({
  clientID: CLIENT_ID,
  domain: CLIENT_DOMAIN
});

export function login() {
  auth.authorize({
    responseType: 'token id_token',
    redirectUri: REDIRECT,
    audience: AUDIENCE,
    scope: SCOPE
  });
}

var router = new Router({
   mode: 'history',
});

export function logout() {
  clearIdToken();
  clearAccessToken();
  router.go('/');
}

export function requireAuth(to, from, next) {
  if (!isLoggedIn()) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    });
  } else {
    next();
  }
}

export function getIdToken() {
  return localStorage.getItem(ID_TOKEN_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function clearIdToken() {
  localStorage.removeItem(ID_TOKEN_KEY);
}

function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

// Helper function that will allow us to extract the access_token and id_token
export function getParameterByName(name) {
  let match = RegExp('[#&]' + name + '=([^&]*)').exec(window.location.hash);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// Get and store access_token in local storage
export function setAccessToken() {
  let accessToken = getParameterByName('access_token');
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
}

// Get and store id_token in local storage
export function setIdToken() {
  let idToken = getParameterByName('id_token');
  localStorage.setItem(ID_TOKEN_KEY, idToken);
}

export function isLoggedIn() {
  const idToken = getIdToken();
  return !!idToken && !isTokenExpired(idToken);
}

function getTokenExpirationDate(encodedToken) {
  const token = decode(encodedToken);
  if (!token.exp) { return null; }

  const date = new Date(0);
  date.setUTCSeconds(token.exp);

  return date;
}

function isTokenExpired(token) {
  const expirationDate = getTokenExpirationDate(token);
  return expirationDate < new Date();
}
