import React, { createContext, useReducer } from 'react';
import { useHistory } from 'react-router-dom';
import { RecordsReducer } from './RecordsReducer';

const initialState = {
  records: [],
  record: {},
  error: '',
  loading: true,
};
export const RecordsContext = createContext(initialState);

export const RecordsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(RecordsReducer, initialState);
  const history = useHistory();
  const getRecords = async (token) => {
    const config = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await (
        await fetch(`${process.env.REACT_APP_BASEURL}/api/v1/records`, config)
      ).json();
      dispatch({
        type: 'GET_RECORDS',
        payload: response.data.records,
      });
      localStorage.setItem('currentRecords', JSON.stringify(response.data.records));
    } catch (err) {
      dispatch({
        type: 'ERROR',
        payload: err.message,
      });
      history.push('/login');
      console.log('err', err);
    }
  };

  const getARecord = async (recordId, token) => {
    const config = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const res = await (
        await fetch(`${process.env.REACT_APP_BASEURL}/api/v1/records/${recordId}`, config)
      ).json();
      dispatch({
        type: 'GET_A_RECORD',
        payload: res.data.record,
      });
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: error.message,
      });
      history.push('/dashboard');
      console.log('error', error);
    }
  };

  const createRecord = async (body, tkn) => {
    const config = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tkn}`,
      },
      body: JSON.stringify(body),
    };
    try {
      const res = await (
        await fetch(`${process.env.REACT_APP_BASEURL}/api/v1/records`, config)
      ).json();
      dispatch({
        type: 'CREATE_A_RECORD',
        payload: res.data.record,
      });
      history.push(`/records/${res.data.record.id}/view`);
    } catch (error) {
      dispatch({
        type: 'ERROR',
        payload: error.message,
      });
      console.log('error', error);
    }
  };

  const deleteRecord = async (recordId, tkn) => {
    const config = {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${tkn}`,
      },
    };
    const res = await (await fetch(`${process.env.REACT_APP_BASEURL}/api/v1/records/${recordId}`, config)).json();
    if (res.status === 200) { history.push('/dashboard'); }
  };
  return (
    <RecordsContext.Provider value={{
      ...state, getRecords, getARecord, createRecord, deleteRecord,
    }}
    >
      {children}
    </RecordsContext.Provider>
  );
};