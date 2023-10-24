import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';
// utils
import { loginAPI, meAPI, signUpAPI } from '../service/sim/auth.service';
import { setSession } from '../utils/jwt';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken) {
          const response = await meAPI();
          const { code, data, message } = response;
          if (code === '200')
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user: data,
              },
            });
          else throw message;
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (username, password) => {
    const response = await loginAPI({
      username,
      password,
    });
    const { code, data, message } = response;
    if (code === '200') {
      const { accessToken, refreshToken, user } = data;
      setSession(accessToken, refreshToken);
      dispatch({
        type: 'LOGIN',
        payload: {
          user,
        },
      });
    } else {
      throw message;
    }
  };

  const register = async (request) => {
    const response = await signUpAPI(request);
    const { code, data, message } = response;
    if (code !== '200') {
      throw message;
    } else {
      const { accessToken, refreshToken, user } = data;
      setSession(accessToken, refreshToken);
      dispatch({
        type: 'REGISTER',
        payload: {
          user,
        },
      });
    }
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
