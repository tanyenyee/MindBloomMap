// src/context/AuthContext.js - 临时安全版本

import React, { createContext, useContext, useState } from 'react';

// 1. 创建 Context
const AuthContext = createContext();

// 2. 导出 AuthProvider 组件
// 这个组件现在不执行任何 Firebase 认证操作
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  // 临时模拟登录和注册函数
  const signIn = (email, password) => {
    console.log("认证已被临时跳过：尝试登录");
    return Promise.resolve(true);
  };
  const signUp = (email, password) => {
    console.log("认证已被临时跳过：尝试注册");
    return Promise.resolve(true);
  };
  const logOut = () => {
    console.log("认证已被临时跳过：尝试退出");
    setUser(null);
    return Promise.resolve(true);
  };

  const value = {
    user,
    setUser,
    signIn,
    signUp,
    logOut,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return context;
};
