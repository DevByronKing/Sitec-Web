// src/App.jsx
import React, { useState, useEffect, useMemo, useCallback, Fragment } from 'react';
import { Transition } from '@headlessui/react'; // Para modais

// --- IMPORTAÇÕES DO FIREBASE ---
import { auth, db, app } from './firebaseConfig';
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendPasswordResetEmail,
  signInWithCustomToken,
  signInAnonymously
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  serverTimestamp,
  deleteDoc
} from "firebase/firestore";

// --- ÍCONES SVG COMO COMPONENTES ---
const Icon = ({ name, className }) => {
  const icons = {
    // Ícones existentes
    logo: <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />,
    shieldCheck: <><path d="M20 13c0 5-6 9-8 9s-8-4-8-9V5l8-3 8 3z"/><path d="m9 12 2 2 4-4"/></>,
    user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    userPlus: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="16" x2="22" y1="11" y2="11"/></>,
    keyRound: <><path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z"/><circle cx="16.5" cy="7.5" r=".5"/></>,
    logOut: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>,
    printer: <><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></>,
    calendarDays: <><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></>,
    fileText: <><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    home: <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />,
    folderKanban: <><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><path d="M8 10v4"/><path d="M12 10v2"/><path d="M16 10v6"/></>,
    pieChart: <><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>,
    settings: <><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0 2l.15.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></>,
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
    bell: <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></>,
    moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>,
    barChart: <path d="M3 3v18h18" />,
    sparkles: <path d="m12 3-1.9 3.9-3.9 1.9 3.9 1.9 1.9 3.9 1.9-3.9 3.9-1.9-3.9-1.9L12 3zM5 11l-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2zm14 0-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2z"/>,
    briefcase: <><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    menu: <><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></>,
    x: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    // Novos ícones
    send: <><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    messageCircle: <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>,
    lifeBuoy: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" x2="9.17" y1="4.93" y2="9.17"/><line x1="14.83" x2="19.07" y1="4.93" y2="9.17"/><line x1="14.83" x2="19.07" y1="19.07" y2="14.83"/><line x1="4.93" x2="9.17" y1="19.07" y2="14.83"/></>,
    ticket: <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></>,
    helpCircle: <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></>,
    building: <><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></>,
    plus: <><path d="M5 12h14"/><path d="M12 5v14"/></>,
    edit: <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>,
    trash: <path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>,
  };
  
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {icons[name]}
    </svg>
  );
};

// --- DADOS MOCKADOS (Removidos, usaremos Firestore) ---

// --- HOOKS (Modificado) ---
const useFilteredProcesses = (searchQuery, processes) => {
  // Agora recebe 'processes' do Firestore como argumento
  return useMemo(() => {
    if (!processes) return [];
    if (!searchQuery) return processes;
    const lowercasedQuery = searchQuery.toLowerCase();
    return processes.filter(p =>
      p.id.toLowerCase().includes(lowercasedQuery) ||
      (p.solicitante && p.solicitante.toLowerCase().includes(lowercasedQuery)) || // solicitante pode não existir
      p.status.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, processes]);
};

// --- FUNÇÕES UTILITÁRIAS ---
const getStatusClass = (status) => {
  const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
  switch (status) {
    case 'Aprovado':
    case 'Concluído':
    case 'Fechado':
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100`;
    case 'Pendente':
    case 'Aberto':
      return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100`;
    case 'Em Análise':
    case 'Em Andamento':
    case 'Em Atendimento':
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100`;
    case 'Rejeitado':
      return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100`;
    default:
      return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100`;
  }
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  // Converte Timestamp do Firestore para Date do JS
  const date = timestamp.toDate();
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate();
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};


// --- COMPONENTES ---

// --- Componente Modal Genérico ---
const Modal = ({ isOpen, onClose, title, children }) => {
  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity dark:bg-gray-900 dark:bg-opacity-75" aria-hidden="true" onClick={onClose}></div>
          </Transition.Child>

          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-xl leading-6 font-bold text-gray-900 dark:text-white mb-4" id="modal-title">
                      {title}
                    </h3>
                    <div className="mt-2">
                      {children}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onClose}
                >
                  Fechar
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );
};


const AuthLayout = ({ title, description, icon, iconColor, children }) => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors duration-300">
    <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col items-center mb-6">
        <div className={`p-3 rounded-full ${iconColor} bg-opacity-10 mb-4`}>
          <Icon name={icon} className={`w-10 h-10 ${iconColor}`} />
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">{title}</h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
      </div>
      {children}
    </div>
  </div>
);

const InputField = ({ id, label, type, value, onChange, disabled, required, placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      id={id}
      type={type}
      className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 disabled:opacity-50"
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({ id, label, value, onChange, disabled, required, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <select
      id={id}
      className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 disabled:opacity-50"
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
    >
      {children}
    </select>
  </div>
);


// --- LoginComponent (ATUALIZADO PARA FIREBASE) ---
const LoginComponent = ({ onViewChange, onLogin }) => {
  const [email, setEmail] = useState(''); // Alterado de username para email
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    try {
      // 1. Tenta fazer login com email e senha
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // 2. O listener onAuthStateChanged (no App) vai detectar o login,
      //    buscar os dados do Firestore e mudar a view.
      //    Não precisamos fazer mais nada aqui.
    } catch (error) {
      // Trata erros
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        setMessage('E-mail ou senha inválidos.');
      } else {
        setMessage('Ocorreu um erro. Tente novamente.');
      }
      setIsSubmitting(false);
      console.error("Erro no login:", error.message);
    }
  };

  return (
    <AuthLayout title="Login" description="Acesso à Plataforma de Gestão Pública" icon="logo" iconColor="text-blue-600">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div role="alert" className="bg-red-100 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-md text-sm text-center">
            <p>{message}</p>
          </div>
        )}
        <InputField
          id="email"
          label="E-mail"
          type="email"
          placeholder="seu.email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <InputField
          id="password"
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <div className="flex items-center justify-end text-sm">
          <button
            type="button"
            onClick={() => onViewChange('forgotPassword')}
            className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
            disabled={isSubmitting}
          >
            Esqueceu sua senha?
          </button>
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Não tem uma conta?{' '}
        <button
          onClick={() => onViewChange('register')}
          type="button"
          className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          disabled={isSubmitting}
        >
          Cadastre-se aqui
        </button>
      </div>
    </AuthLayout>
  );
};

// --- RegisterComponent (ATUALIZADO PARA FIREBASE E COM CAMPO SETOR) ---
const RegisterComponent = ({ onViewChange }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    registration: '',
    email: '',
    setor: '', // Novo campo Setor
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lista de setores (pode vir do Firestore no futuro)
  const setores = ["", "Recursos Humanos", "Financeiro", "Tecnologia da Informação", "Logística", "Administrativo"];


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }
    if (formData.password.length < 6) {
        setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres.' });
        return;
    }
    if (formData.setor === "") {
        setMessage({ type: 'error', text: 'Por favor, selecione um setor.' });
        return;
    }

    setIsSubmitting(true);

    try {
      // 1. Cria o usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Salva os dados extras no Firestore
      // Perfil padrão para novos registros será 'Analista'
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: formData.fullName,
        registration: formData.registration,
        email: formData.email,
        setor: formData.setor, // Salva o setor
        role: 'Analista', // Perfil padrão 'Analista' (antigo 'Servidor')
        createdAt: serverTimestamp() // Boa prática
      });

      // Sucesso
      setIsSubmitting(false);
      setMessage({ type: 'success', text: 'Conta criada com sucesso! Você será redirecionado para o login.' });
      setTimeout(() => onViewChange('login'), 2000);

    } catch (error) {
      setIsSubmitting(false);
      if (error.code === 'auth/email-already-in-use') {
        setMessage({ type: 'error', text: 'Este e-mail já está em uso.' });
      } else {
        setMessage({ type: 'error', text: 'Erro ao criar conta. Tente novamente.' });
      }
      console.error("Erro no registro:", error);
    }
  };

  return (
    <AuthLayout title="Cadastre-se" description="Crie sua conta na Plataforma" icon="userPlus" iconColor="text-green-600">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message.text && (
          <div role="alert" className={`${message.type === 'error' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-green-100 border-green-500 text-green-700'} border-l-4 p-4 rounded-md text-sm text-center`}>
            <p>{message.text}</p>
          </div>
        )}
        <InputField id="fullName" label="Nome Completo" type="text" value={formData.fullName} onChange={handleChange} disabled={isSubmitting} required />
        <InputField id="registration" label="Matrícula" type="text" value={formData.registration} onChange={handleChange} disabled={isSubmitting} required />
        <InputField id="email" label="Email" type="email" value={formData.email} onChange={handleChange} disabled={isSubmitting} required />
        
        {/* NOVO CAMPO DE SELEÇÃO DE SETOR */}
        <SelectField id="setor" label="Setor" value={formData.setor} onChange={handleChange} disabled={isSubmitting} required>
          {setores.map(setor => (
            <option key={setor} value={setor}>{setor || 'Selecione seu setor'}</option>
          ))}
        </SelectField>

        <InputField id="password" label="Senha (mín. 6 caracteres)" type="password" value={formData.password} onChange={handleChange} disabled={isSubmitting} required />
        <InputField id="confirmPassword" label="Confirmar Senha" type="password" value={formData.confirmPassword} onChange={handleChange} disabled={isSubmitting} required />
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Já tem uma conta?{' '}
        <button
          onClick={() => onViewChange('login')}
          type="button"
          className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          disabled={isSubmitting}
        >
          Faça login aqui
        </button>
      </div>
    </AuthLayout>
  );
};

// --- ForgotPasswordComponent (ATUALIZADO COM FIREBASE) ---
const ForgotPasswordComponent = ({ onViewChange }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await sendPasswordResetEmail(auth, email);
      setIsSubmitting(false);
      setMessage({ type: 'success', text: 'Se um e-mail correspondente for encontrado, um link de recuperação foi enviado.' });
      setEmail('');
    } catch (error) {
      setIsSubmitting(false);
      console.error("Erro ao enviar email de recuperação:", error);
      // Não informamos o erro exato por segurança
      setMessage({ type: 'success', text: 'Se um e-mail correspondente for encontrado, um link de recuperação foi enviado.' });
    }
  };

   return (
    <AuthLayout title="Recuperar Senha" description="Insira seu e-mail para receber o link de redefinição" icon="keyRound" iconColor="text-yellow-500">
      <form onSubmit={handleSubmit} className="space-y-4">
        {message.text && (
          <div role="alert" className={`${message.type === 'success' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-red-100 border-red-500 text-red-700'} border-l-4 p-4 rounded-md text-sm text-center`}>
            <p>{message.text}</p>
          </div>
        )}
        <InputField
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isSubmitting}
          placeholder="seu.email@exemplo.com"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Enviando...' : 'Enviar Link de Recuperação'}
        </button>
      </form>
      <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        Lembrou sua senha?{' '}
        <button
          onClick={() => onViewChange('login')}
          type="button"
          className="text-blue-600 hover:text-blue-500 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          disabled={isSubmitting}
        >
          Voltar para o Login
        </button>
      </div>
    </AuthLayout>
  );
};

// --- Componentes do Dashboard (Sidebar, Header, Layouts, etc.) ---
// --- ATUALIZADOS COM NOVOS PERFIS E FUNCIONALIDADES ---
const Sidebar = ({ user, onLogout, activeTab, onTabChange, isMobileSidebarOpen, setIsMobileSidebarOpen }) => {
  const navItems = {
    'Gestor': [
      { icon: 'home', label: 'Início' },
      { icon: 'folderKanban', label: 'Processos' },
      { icon: 'pieChart', label: 'Relatórios' },
      { icon: 'briefcase', label: 'Ferramentas' },
      { icon: 'settings', label: 'Configurações' }
    ],
    // 'Servidor' agora é 'Analista'
    'Analista': [
      { icon: 'home', label: 'Início' },
      { icon: 'folderKanban', label: 'Processos' }, // Renomeado de 'Meus Processos'
      { icon: 'briefcase', label: 'Ferramentas' },
      { icon: 'settings', label: 'Configurações' } // Adicionado
    ],
    // 'Visitante' agora é 'Suporte'
    'Suporte': [
      { icon: 'home', label: 'Início' },
      { icon: 'ticket', label: 'Tickets' }, // Nova aba para Suporte
      { icon: 'briefcase', label: 'Ferramentas' }
    ],
  };

  // Fallback caso o role não exista (ex: durante o carregamento)
  const currentNavItems = navItems[user?.role] || [];


  const handleTabChange = (label) => {
    onTabChange(label);
    if (setIsMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-20 border-b border-gray-200 dark:border-gray-700 px-4">
        <div className="flex items-center">
          <Icon name="logo" className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold ml-2 text-gray-800 dark:text-white">SITEC</h1>
        </div>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {currentNavItems.map(item => {
          const isActive = activeTab === item.label;
          return (
            <button
              onClick={() => handleTabChange(item.label)}
              key={item.label}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg group transition-colors duration-150 ${
                isActive
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon
                name={item.icon}
                className={`h-5 w-5 mr-3 transition-colors duration-150 ${
                  isActive
                  ? 'text-white'
                  : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                }`}
              />
              {item.label}
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <img className="h-10 w-10 rounded-full object-cover bg-gray-200" src={user.avatar} alt="Avatar do usuário" />
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">{user.username}</p>
            {/* Exibe o Perfil (Role) e o Setor (se for Analista) */}
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
            {user.role === 'Analista' && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.setor}</p>
            )}
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center justify-center mt-4 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition duration-150 ease-in-out">
          <Icon name="logOut" className="w-4 h-4 mr-2" />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar para Desktop */}
      <aside className="w-64 bg-white dark:bg-gray-800 flex-col border-r border-gray-200 dark:border-gray-700 transition-colors duration-300 hidden md:flex flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Overlay para Mobile */}
      <Transition show={isMobileSidebarOpen} as={Fragment}>
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          {/* Background Overlay */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60" onClick={() => setIsMobileSidebarOpen(false)} aria-hidden="true"></div>
          </Transition.Child>

          {/* Conteúdo da Sidebar Mobile */}
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800`}>
              <div className="absolute top-0 right-0 -mr-12 pt-2">
                <button
                  type="button"
                  className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  onClick={() => setIsMobileSidebarOpen(false)}
                >
                  <span className="sr-only">Fechar sidebar</span>
                  <Icon name="x" className="h-6 w-6 text-white" />
                </button>
              </div>
              <SidebarContent />
            </div>
          </Transition.Child>
        </div>
      </Transition>
    </>
  );
};


const Header = ({ user, darkMode, toggleDarkMode, searchQuery, setSearchQuery, setIsMobileSidebarOpen, onNotificationClick }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = time.toLocaleDateString('pt-BR', { dateStyle: 'full' });

  return (
    <header className="flex-shrink-0 flex items-center justify-between h-20 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-8 transition-colors duration-300">
      <div className="flex items-center">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden mr-4 p-2 -ml-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Abrir menu"
        >
          <Icon name="menu" className="h-6 w-6" />
        </button>
        <div className="overflow-hidden">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white truncate">Olá, {user?.username || 'Usuário'}!</h2>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{formattedDate}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="hidden md:block relative w-64">
          <label htmlFor="search-process" className="sr-only">Buscar</label>
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon name="search" className="h-5 w-5 text-gray-400"/>
          </span>
          <input
            id="search-process"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-200 hidden lg:block" aria-label={`Horário atual: ${formattedTime}`}>{formattedTime}</p>
        <button onClick={toggleDarkMode} className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label={darkMode ? "Ativar modo claro" : "Ativar modo escuro"}>
          <Icon name={darkMode ? 'sun' : 'moon'} className="h-6 w-6" />
        </button>
        {/* Botão de Notificação/Mensagens ATUALIZADO */}
        <button
          onClick={onNotificationClick}
          className="relative p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Ver notificações e mensagens"
        >
          {/* Ícone muda para 'messageCircle' */}
          <Icon name="messageCircle" className="h-6 w-6" />
          {/* Lógica de notificação (ponto vermelho) pode ser adicionada aqui com base no estado */}
          {/* <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-800"></span> */}
          <span className="sr-only">Abrir notificações e mensagens</span>
        </button>
      </div>
    </header>
  );
};

const DashboardLayout = ({ user, onLogout, darkMode, toggleDarkMode, children, activeTab, setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  if (!user) {
     return null; // Spinner de loading já está no App
  }

  const handleNotificationClick = () => {
    setIsNotificationModalOpen(true);
  };

  return (
    <div className={`flex h-screen bg-gray-100 dark:bg-gray-900 font-sans`}>
      <Sidebar
        user={user}
        onLogout={onLogout}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
          onNotificationClick={handleNotificationClick} // Passa a função para o Header
        />
        {/* Layout melhorado com mais padding */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6 md:p-10 transition-colors duration-300">
          <div id="printable-area">
            {React.Children.map(children, child =>
              React.cloneElement(child, { searchQuery, activeTab, user, darkMode, toggleDarkMode, db, auth, app })
            )}
          </div>
        </main>
      </div>
      
      {/* Modal de Notificações/Mensagens */}
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        user={user}
      />
    </div>
  );
};

// --- Componente de Placeholder ---
const PlaceholderComponent = ({ title, message }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{title}</h2>
    <p className="text-gray-500 dark:text-gray-400 mt-4">{message || "Esta funcionalidade está em desenvolvimento e será disponibilizada em breve."}</p>
  </div>
);

// --- Componente de Ferramentas (ATUALIZADO) ---
const FerramentasComponent = ({ user }) => {
  const tools = [
    { name: "Hollides", description: "Analisador de férias para otimizar o planejamento da equipe.", icon: "calendarDays", color: "orange", link: "https://hollides.vercel.app/" },
    { name: "Reader", description: "Leitor de documentos PDF integrado à plataforma.", icon: "fileText", color: "red", link: "https://reader-tau-azure.vercel.app/" },
    { name: "Ticker", description: "Relógio de ponto digital para registro de jornada de trabalho.", icon: "clock", color: "green", link: "https://ticker-ccm.vercel.app/" },
  ];

  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState({ subject: '', message: '' });
  const [isSubmittingTicket, setIsSubmittingTicket] = useState(false);
  const [ticketStatus, setTicketStatus] = useState('');


  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    if (!supportMessage.subject || !supportMessage.message) {
      setTicketStatus('Por favor, preencha todos os campos.');
      return;
    }
    setIsSubmittingTicket(true);
    setTicketStatus('');

    try {
      // Salva o ticket no Firestore
      await addDoc(collection(db, "supportTickets"), {
        fromId: user.uid,
        fromName: user.username,
        fromEmail: user.email,
        fromSetor: user.setor || 'N/A',
        subject: supportMessage.subject,
        message: supportMessage.message,
        status: "Aberto", // Status inicial
        createdAt: serverTimestamp(),
      });
      setIsSubmittingTicket(false);
      setTicketStatus('Ticket enviado com sucesso!');
      setSupportMessage({ subject: '', message: '' });
      // Fecha o modal após um tempo
      setTimeout(() => setIsSupportModalOpen(false), 2000);
    } catch (error) {
      console.error("Erro ao enviar ticket:", error);
      setIsSubmittingTicket(false);
      setTicketStatus('Erro ao enviar ticket. Tente novamente.');
    }
  };

  const ToolCard = ({ tool, isSupport = false, onClick }) => {
    const color = isSupport ? 'purple' : tool.color;
    const colorClasses = {
      orange: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-600 dark:text-orange-400', button: 'bg-orange-600 hover:bg-orange-700' },
      red: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-600 dark:text-red-400', button: 'bg-red-600 hover:bg-red-700' },
      green: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-600 dark:text-green-400', button: 'bg-green-600 hover:bg-green-700' },
      purple: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-600 dark:text-purple-400', button: 'bg-purple-600 hover:bg-purple-700' },
    };
    const classes = colorClasses[color];

    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center transition-transform transform hover:-translate-y-1">
        <div className={`p-4 rounded-full ${classes.bg} mb-4`}>
          <Icon name={isSupport ? "lifeBuoy" : tool.icon} className={`h-8 w-8 ${classes.text}`} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{isSupport ? "Contatar Suporte" : tool.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex-grow">{isSupport ? "Precisa de ajuda? Abra um ticket." : tool.description}</p>
        {isSupport ? (
          <button
            onClick={onClick}
            className={`w-full block mt-auto px-4 py-2 text-sm font-medium text-white ${classes.button} rounded-lg transition`}
          >
            Abrir Chamado
          </button>
        ) : (
          <a
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full block mt-auto px-4 py-2 text-sm font-medium text-white ${classes.button} rounded-lg transition`}
          >
            Acessar Ferramenta
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Central de Ferramentas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tools.map(tool => <ToolCard key={tool.name} tool={tool} />)}
        
        {/* Adiciona o card de "Contatar Suporte" apenas para Analista e Gestor */}
        {(user.role === 'Analista' || user.role === 'Gestor') && (
          <ToolCard isSupport={true} onClick={() => {
            setIsSupportModalOpen(true);
            setTicketStatus(''); // Limpa status ao abrir
          }} />
        )}
      </div>

      {/* Modal para Contatar Suporte */}
      <Modal isOpen={isSupportModalOpen} onClose={() => setIsSupportModalOpen(false)} title="Abrir Chamado de Suporte">
        <form onSubmit={handleSupportSubmit} className="space-y-4">
          <InputField
            id="supportSubject"
            label="Assunto"
            type="text"
            value={supportMessage.subject}
            onChange={(e) => setSupportMessage(prev => ({...prev, subject: e.target.value}))}
            disabled={isSubmittingTicket}
            required
            placeholder="Ex: Erro ao registrar processo"
          />
          <div>
            <label htmlFor="supportMessage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mensagem</label>
            <textarea
              id="supportMessage"
              rows="4"
              className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 disabled:opacity-50"
              value={supportMessage.message}
              onChange={(e) => setSupportMessage(prev => ({...prev, message: e.target.value}))}
              disabled={isSubmittingTicket}
              required
              placeholder="Descreva seu problema ou solicitação..."
            ></textarea>
          </div>
          {ticketStatus && (
            <p className={`text-sm ${ticketStatus.includes('Erro') ? 'text-red-500' : 'text-green-500'}`}>{ticketStatus}</p>
          )}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmittingTicket}
              className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmittingTicket ? 'Enviando...' : 'Enviar Ticket'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

// --- Componentes de Configurações (ATUALIZADOS) ---
const SettingsInputField = ({ id, label, type, name, value, onChange, placeholder, disabled = false }) => (
  <div className="flex-1">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      id={id}
      name={name}
      type={type}
      className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-600"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  </div>
);

const ToggleSwitch = ({ id, name, label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-2">
    <div>
      <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
    </div>
    <button
      id={id}
      name={name}
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange({ target: { name, checked: !checked } })}
      className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
    >
      <span className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  </div>
);

const ProfileSettings = ({ user }) => {
  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    setor: user?.setor || '',
    registration: user?.registration || '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
     if(user) {
         setProfile({
            username: user.username,
            email: user.email,
            avatar: user.avatar || '',
            setor: user.setor || 'N/A',
            registration: user.registration || 'N/A'
         });
     }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setMessage('');

    try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userDocRef, {
            fullName: profile.username,
            avatar: profile.avatar,
            // O setor e matrícula também podem ser atualizados se desejado
            setor: profile.setor,
            registration: profile.registration
        });
        
        setMessage('Perfil salvo com sucesso!');
        // Opcional: Atualizar o estado 'user' no componente App (requer prop-drilling de um setter)
    } catch (error) {
        console.error("Erro ao salvar perfil:", error);
        setMessage('Erro ao salvar perfil.');
    }
  };


  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Perfil Público</h3>
      {message && <p className="text-sm text-green-500 mb-4">{message}</p>}
      <form onSubmit={handleProfileSave} className="space-y-6">
        <div className="flex items-center space-x-4">
          <img src={profile.avatar || `https://placehold.co/100x100/eeeeee/333333?text=${profile.username?.charAt(0) || '?'}`} alt="Avatar" className="w-16 h-16 rounded-full object-cover" />
          <SettingsInputField id="avatar" label="URL do Avatar" type="text" name="avatar" value={profile.avatar} onChange={handleProfileChange} />
        </div>
        <SettingsInputField id="username" label="Nome Completo" type="text" name="username" value={profile.username} onChange={handleProfileChange} />
        <SettingsInputField id="email-profile" label="Email" type="email" name="email" value={profile.email} onChange={() => {}} disabled={true}/>
        <SettingsInputField id="registration-profile" label="Matrícula" type="text" name="registration" value={profile.registration} onChange={handleProfileChange} />
        <SettingsInputField id="setor-profile" label="Setor" type="text" name="setor" value={profile.setor} onChange={handleProfileChange} disabled={user.role !== 'Gestor'}/>
        
        <div className="flex justify-end pt-2">
          <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  );
};

const AppearanceSettings = ({ darkMode, toggleDarkMode }) => (
  <div className="animate-fade-in">
    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Aparência</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-4">Personalize a aparência do sistema ao seu gosto.</p>
    <ToggleSwitch
      id="dark-mode-toggle"
      name="darkMode"
      label="Modo Escuro"
      description="Ative para uma experiência com menos brilho."
      checked={darkMode}
      onChange={toggleDarkMode}
    />
  </div>
);

const SecuritySettings = () => {
  // Lógica de alterar senha (updatePassword) é complexa e requer reautenticação
  // Por enquanto, apenas UI
  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Segurança da Conta</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Para alterar sua senha, recomendamos usar a função "Esqueceu sua senha?" na tela de login por enquanto.</p>
      {/* Formulário de Alteração de Senha (desabilitado para simplicidade) */}
      <form className="space-y-4 opacity-50">
        <SettingsInputField id="currentPassword" name="current" label="Senha Atual" type="password" disabled />
        <SettingsInputField id="newPassword" name="new" label="Nova Senha" type="password" disabled />
        <SettingsInputField id="confirmPassword" name="confirm" label="Confirmar Nova Senha" type="password" disabled />
        <div className="flex justify-end pt-2">
          <button type="button" disabled className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-sm disabled:opacity-50">
            Alterar Senha
          </button>
        </div>
      </form>
    </div>
  );
};

const NotificationSettings = () => {
  // Apenas UI, lógica a ser implementada
  return (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Preferências de Notificação</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">Escolha como você deseja ser notificado sobre as atividades.</p>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        <ToggleSwitch id="email-notifications" name="email" label="Notificações por E-mail" description="Receba resumos e alertas importantes." checked={true} onChange={() => {}} />
        <ToggleSwitch id="in-app-notifications" name="inApp" label="Notificações na Plataforma" description="Mostra alertas dentro do sistema." checked={true} onChange={() => {}} />
      </div>
    </div>
  );
};

const SettingsComponent = ({ user, darkMode, toggleDarkMode }) => {
  const [activeSettingTab, setActiveSettingTab] = useState('perfil');
  const tabs = [
    { id: 'perfil', label: 'Perfil', icon: 'user' },
    { id: 'aparencia', label: 'Aparência', icon: 'sun' },
    { id: 'seguranca', label: 'Segurança', icon: 'shieldCheck' },
    { id: 'notificacoes', label: 'Notificações', icon: 'bell' },
  ];

  const renderTabContent = () => {
    switch (activeSettingTab) {
      case 'perfil': return <ProfileSettings user={user} />;
      case 'aparencia': return <AppearanceSettings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      case 'seguranca': return <SecuritySettings />;
      case 'notificacoes': return <NotificationSettings />;
      default: return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Configurações</h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Menu Lateral de Configurações */}
        <nav className="flex md:flex-col md:w-1/4" aria-label="Configurações">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSettingTab(tab.id)}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-left ${
                activeSettingTab === tab.id
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon name={tab.icon} className="h-5 w-5 flex-shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Conteúdo da Aba de Configuração */}
        <div className="md:w-3/4">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

// --- NOVOS COMPONENTES PARA 'ANALISTA' ---

// --- Modal de Registro/Edição de Processo ---
const ProcessoModal = ({ isOpen, onClose, user, existingProcess }) => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Iniciado');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const statusOptions = ["Iniciado", "Em Andamento", "Pendente", "Concluído", "Rejeitado"];

  useEffect(() => {
    if (existingProcess) {
      setContent(existingProcess.content || '');
      setStatus(existingProcess.status || 'Iniciado');
    } else {
      // Reset para novo processo
      setContent('');
      setStatus('Iniciado');
    }
    setMessage('');
  }, [existingProcess, isOpen]); // Reseta o form quando o modal abre

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || !status) {
      setMessage('Por favor, preencha todos os campos.');
      return;
    }
    setIsSubmitting(true);
    setMessage('');

    try {
      const processData = {
        content: content,
        status: status,
        updatedAt: serverTimestamp(),
      };

      if (existingProcess) {
        // --- ATUALIZAR PROCESSO ---
        const processRef = doc(db, "processes", existingProcess.id);
        await updateDoc(processRef, processData);
        setMessage('Processo alterado com sucesso!');
      } else {
        // --- REGISTRAR NOVO PROCESSO ---
        await addDoc(collection(db, "processes"), {
          ...processData,
          analistaId: user.uid,
          analistaName: user.username,
          setor: user.setor,
          createdAt: serverTimestamp(),
        });
        setMessage('Processo registrado com sucesso!');
      }
      
      setIsSubmitting(false);
      setTimeout(() => {
        onClose(); // Fecha o modal
      }, 1500);

    } catch (error) {
      console.error("Erro ao salvar processo:", error);
      setMessage('Erro ao salvar. Tente novamente.');
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingProcess ? 'Alterar Processo' : 'Registrar Novo Processo'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="processContent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Produção / Andamento
          </label>
          <textarea
            id="processContent"
            rows="5"
            className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100 disabled:opacity-50"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            required
            placeholder="Descreva o trabalho realizado, solicitação ou andamento do processo..."
          ></textarea>
        </div>
        
        <SelectField
          id="processStatus"
          label="Status do Processo"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={isSubmitting}
          required
        >
          {statusOptions.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </SelectField>

        {message && (
          <p className={`text-sm ${message.includes('Erro') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Processo'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

// --- Gerenciador de Processos (para Analista) ---
const GerenciadorProcessosAnalista = ({ user, searchQuery }) => {
  const [processes, setProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState(null); // Para edição

  // Busca processos do analista em tempo real
  useEffect(() => {
    if (!user?.uid) return;

    setIsLoading(true);
    const q = query(
      collection(db, "processes"),
      where("analistaId", "==", user.uid)
      // Ordenar por data (opcional, requer índice no Firestore)
      // orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const processesData = [];
      querySnapshot.forEach((doc) => {
        processesData.push({ id: doc.id, ...doc.data() });
      });
      // Ordenação manual no cliente para evitar problemas de índice
      processesData.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
      setProcesses(processesData);
      setIsLoading(false);
    }, (err) => {
      console.error("Erro ao buscar processos:", err);
      setError("Não foi possível carregar os processos.");
      setIsLoading(false);
    });

    return () => unsubscribe(); // Limpa o listener
  }, [user?.uid]);

  const filteredProcesses = useFilteredProcesses(searchQuery, processes);

  const handleOpenModal = (process = null) => {
    setSelectedProcess(process); // Seta null para novo, ou o processo para editar
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProcess(null); // Limpa seleção
  };

  if (isLoading) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Carregando processos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Meus Processos Registrados</h2>
        <button
          onClick={() => handleOpenModal(null)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg"
        >
          <Icon name="plus" className="w-4 h-4"/>
          Registrar Processo
        </button>
      </div>
      
      {(!filteredProcesses || filteredProcesses.length === 0) ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? "Nenhum processo encontrado para sua busca." : "Você ainda não registrou nenhum processo."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Última Atualização</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Resumo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProcesses.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDateTime(process.updatedAt || process.createdAt)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white max-w-xs truncate">{process.content}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={getStatusClass(process.status)}>{process.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button onClick={() => handleOpenModal(process)} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <Icon name="edit" className="w-5 h-5" />
                    </button>
                    {/* Botão de excluir (opcional) */}
                    {/* <button onClick={() => deleteDoc(doc(db, "processes", process.id))} className="text-red-600 hover:text-red-800 ml-2">
                      <Icon name="trash" className="w-5 h-5" />
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de Registro/Edição */}
      <ProcessoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        user={user}
        existingProcess={selectedProcess}
      />
    </div>
  );
};

// --- Componente da Aba Início do Analista ---
const AnalistaInicioComponent = () => {
  const faqs = [
    { q: "Como registro minha produção diária?", a: "Vá para a aba 'Processos' e clique no botão 'Registrar Processo'. Preencha os detalhes do trabalho e o status atual." },
    { q: "Como altero um processo que registrei?", a: "Na aba 'Processos', encontre o processo na lista e clique no ícone de 'Editar' (lápis) para fazer alterações." },
    { q: "Para que serve a aba 'Ferramentas'?", a: "A aba 'Ferramentas' contém links para sistemas auxiliares como o Hollides (férias), Reader (PDFs) e Ticker (ponto). Você também pode contatar o Suporte por lá." },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      {/* 1. Sobre */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 flex items-center">
          <Icon name="info" className="w-6 h-6 mr-3 text-blue-600"/>
          Sobre o SITEC
        </h2>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Bem-vindo ao SITEC, a sua plataforma unificada de gestão de processos. Este sistema foi desenhado para simplificar seu dia-a-dia, permitindo o registro, acompanhamento e gestão da sua produção de forma transparente.
        </p>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
          Use a aba <strong>Processos</strong> para prestar contas do seu trabalho e a aba <strong>Ferramentas</strong> para acessar sistemas auxiliares e pedir ajuda.
        </p>
      </div>

      {/* 2. Perguntas Recorrentes (FAQ) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
          <Icon name="helpCircle" className="w-6 h-6 mr-3 text-green-600"/>
          Perguntas Recorrentes
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details key={index} className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none">
                <span className="text-lg font-medium text-gray-800 dark:text-white group-hover:text-blue-600">{faq.q}</span>
                <span className="text-blue-600 transform transition-transform duration-200 group-open:rotate-180">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </span>
              </summary>
              <p className="text-gray-600 dark:text-gray-300 mt-2 ml-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* 3. Notificações (Placeholder) */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3 flex items-center">
          <Icon name="bell" className="w-6 h-6 mr-3 text-yellow-500"/>
          Notificações
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center py-4">
          Nenhuma notificação nova. Mensagens podem ser vistas no ícone <Icon name="messageCircle" className="w-4 h-4 inline-block -mt-1"/> no canto superior direito.
        </p>
      </div>
    </div>
  );
};

// --- NOVOS COMPONENTES PARA 'GESTOR' ---

// --- Gerenciador de Processos (para Gestor/Admin) ---
const GerenciadorProcessosGestor = ({ user, searchQuery }) => {
  const [processes, setProcesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Busca TODOS os processos em tempo real
  useEffect(() => {
    setIsLoading(true);
    // Query para buscar todos os processos
    const q = query(collection(db, "processes"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const processesData = [];
      querySnapshot.forEach((doc) => {
        processesData.push({ id: doc.id, ...doc.data() });
      });
      // Ordenação manual
      processesData.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));
      setProcesses(processesData);
      setIsLoading(false);
    }, (err) => {
      console.error("Erro ao buscar processos (Gestor):", err);
      setError("Não foi possível carregar os processos.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Filtra os processos do Firestore (não mais mock data)
  const filteredProcesses = useMemo(() => {
    if (!processes) return [];
    if (!searchQuery) return processes;
    const lowercasedQuery = searchQuery.toLowerCase();
    return processes.filter(p =>
      (p.analistaName && p.analistaName.toLowerCase().includes(lowercasedQuery)) ||
      (p.setor && p.setor.toLowerCase().includes(lowercasedQuery)) ||
      (p.content && p.content.toLowerCase().includes(lowercasedQuery)) ||
      p.status.toLowerCase().includes(lowercasedQuery)
    );
  }, [searchQuery, processes]);

  if (isLoading) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Carregando processos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Monitoramento de Processos (Todos)</h2>
      
      {(!filteredProcesses || filteredProcesses.length === 0) ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            {searchQuery ? "Nenhum processo encontrado." : "Nenhum processo registrado na plataforma."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Analista</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Setor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Resumo</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Atualizado em</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProcesses.map((process) => (
                <tr key={process.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{process.analistaName || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{process.setor || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">{process.content}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={getStatusClass(process.status)}>{process.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDateTime(process.updatedAt || process.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


// --- NOVOS COMPONENTES PARA 'SUPORTE' ---

const GerenciadorTicketsComponent = ({ user, searchQuery }) => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null); // Para ver detalhes

  // Busca tickets em tempo real
  useEffect(() => {
    setIsLoading(true);
    const q = query(collection(db, "supportTickets")); // Busca todos os tickets

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ticketsData = [];
      querySnapshot.forEach((doc) => {
        ticketsData.push({ id: doc.id, ...doc.data() });
      });
      ticketsData.sort((a, b) => (b.createdAt) - (a.createdAt)); // Mais novos primeiro
      setTickets(ticketsData);
      setIsLoading(false);
    }, (err) => {
      console.error("Erro ao buscar tickets:", err);
      setError("Não foi possível carregar os tickets.");
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredTickets = useMemo(() => {
    if (!tickets) return [];
    if (!searchQuery) return tickets;
    const lowercasedQuery = searchQuery.toLowerCase();
    return tickets.filter(t =>
      (t.fromName && t.fromName.toLowerCase().includes(lowercasedQuery)) ||
      (t.fromSetor && t.fromSetor.toLowerCase().includes(lowercasedQuery)) ||
      (t.subject && t.subject.toLowerCase().includes(lowercasedQuery)) ||
      (t.status && t.status.toLowerCase().includes(lowercasedQuery))
    );
  }, [searchQuery, tickets]);

  const handleStatusChange = async (ticketId, newStatus) => {
    const ticketRef = doc(db, "supportTickets", ticketId);
    try {
      await updateDoc(ticketRef, { status: newStatus });
    } catch (error) {
      console.error("Erro ao atualizar status do ticket:", error);
    }
  };

  if (isLoading) {
    return <div className="text-center text-gray-500 dark:text-gray-400">Carregando tickets...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Gerenciamento de Tickets de Suporte</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Solicitante</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Setor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Assunto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTickets.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{ticket.fromName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{ticket.fromSetor}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">{ticket.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={getStatusClass(ticket.status)}>{ticket.status}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatDate(ticket.createdAt)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <button onClick={() => setSelectedTicket(ticket)} className="text-blue-600 hover:text-blue-800" title="Ver Detalhes">
                    <Icon name="info" className="w-5 h-5" />
                  </button>
                  <select
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                    className="text-xs rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="Aberto">Aberto</option>
                    <option value="Em Atendimento">Em Atendimento</option>
                    <option value="Fechado">Fechado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalhes do Ticket */}
      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Ticket: ${selectedTicket?.subject}`}>
        {selectedTicket && (
          <div className="space-y-4">
            <p><strong>Solicitante:</strong> {selectedTicket.fromName} ({selectedTicket.fromEmail})</p>
            <p><strong>Setor:</strong> {selectedTicket.fromSetor}</p>
            <p><strong>Data:</strong> {formatDateTime(selectedTicket.createdAt)}</p>
            <p><strong>Status:</strong> <span className={getStatusClass(selectedTicket.status)}>{selectedTicket.status}</span></p>
            <div className="mt-4 pt-4 border-t dark:border-gray-600">
              <h4 className="font-semibold">Mensagem:</h4>
              <p className="text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">{selectedTicket.message}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

// --- NOVO MODAL DE NOTIFICAÇÕES / MENSAGENS ---
const NotificationModal = ({ isOpen, onClose, user }) => {
  const [activeTab, setActiveTab] = useState('mensagens');
  const [message, setMessage] = useState('');
  const [recipient, setRecipient] = useState(''); // 'Gestor' ou 'Suporte'
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  
  // Define destinatários com base no perfil
  const recipientOptions = {
    'Analista': [{ role: 'Gestor', name: 'Gestor' }, { role: 'Suporte', name: 'Suporte' }],
    'Gestor': [{ role: 'Suporte', name: 'Suporte' }], // Gestor pode precisar de um seletor de Analistas (complexo)
    'Suporte': [], // Suporte responde via tickets
  };
  const availableRecipients = recipientOptions[user.role] || [];

  useEffect(() => {
    if (availableRecipients.length > 0) {
      setRecipient(availableRecipients[0].role);
    }
  }, [user.role]);

  // Carrega mensagens
  useEffect(() => {
    if (!isOpen) return;
    
    // Query para mensagens enviadas PELO usuário ou PARA O usuário/perfil dele
    const q = query(
      collection(db, "messages"),
      where("participants", "array-contains", user.uid)
      // orderBy("createdAt", "desc") // Requer índice
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      msgs.sort((a, b) => (a.createdAt) - (b.createdAt)); // Mais antigas primeiro
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [isOpen, user.uid]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !recipient) return;
    setIsSending(true);

    let toId = recipient; // Por enquanto, 'Gestor' ou 'Suporte' (role)
    // TODO: Mapear 'Gestor' (role) para um UID específico se houver apenas um gestor
    
    try {
      await addDoc(collection(db, "messages"), {
        text: message,
        fromId: user.uid,
        fromName: user.username,
        toRole: recipient, // Enviando para um perfil
        participants: [user.uid, recipient], // Array para query
        createdAt: serverTimestamp(),
      });
      setMessage('');
      setIsSending(false);
    } catch (error) {
      console.error("Erro ao enviar msg:", error);
      setIsSending(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Central de Comunicação">
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('mensagens')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'mensagens' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Mensagens
        </button>
        <button
          onClick={() => setActiveTab('notificacoes')}
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'notificacoes' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
          Notificações
        </button>
      </div>

      {activeTab === 'mensagens' && (
        <div className="pt-4">
          <div className="h-64 overflow-y-auto bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4">
            {messages.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center">Sem mensagens.</p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.fromId === user.uid ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg max-w-xs ${msg.fromId === user.uid ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'}`}>
                    <p className="text-xs font-bold">{msg.fromName}</p>
                    <p>{msg.text}</p>
                    <p className="text-xs opacity-70 mt-1 text-right">{msg.createdAt ? formatDateTime(msg.createdAt) : 'Enviando...'}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Formulário de envio (Aparece para Analista e Gestor) */}
          {user.role !== 'Suporte' && (
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
              <SelectField
                id="recipient"
                label=""
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-1/3"
              >
                {availableRecipients.map(opt => (
                  <option key={opt.role} value={opt.role}>{opt.name}</option>
                ))}
              </SelectField>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-gray-100"
              />
              <button type="submit" disabled={isSending} className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                <Icon name="send" className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      )}

      {activeTab === 'notificacoes' && (
        <div className="pt-4 text-center text-gray-500 dark:text-gray-400">
          <p>Nenhuma notificação do sistema no momento.</p>
          <p className="text-xs mt-2">(Funcionalidade de notificações automáticas em desenvolvimento)</p>
        </div>
      )}
    </Modal>
  );
};


// --- DASHBOARDS (Atualizados para novos nomes e componentes) ---

// --- Dashboard do GESTOR ---
const DashboardGestorComponent = ({ searchQuery = '', activeTab, user, darkMode, toggleDarkMode }) => {
  const [stats, setStats] = useState({ total: 0, aprovados: 0, emAnalise: 0, taxa: 0 });
  const [summary, setSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  
  // O Gestor agora ouve os processos para estatísticas
  useEffect(() => {
    const q = query(collection(db, "processes"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let total = 0;
      let aprovados = 0;
      let emAnalise = 0;
      querySnapshot.forEach((doc) => {
        total++;
        const data = doc.data();
        if (data.status === 'Aprovado' || data.status === 'Concluído') {
          aprovados++;
        }
        if (data.status === 'Em Análise') {
          emAnalise++;
        }
      });
      setStats({
        total: total,
        aprovados: aprovados,
        emAnalise: emAnalise,
        taxa: total > 0 ? ((aprovados / total) * 100).toFixed(1) : 0
      });
    });
    return () => unsubscribe();
  }, []);

  const StatCard = ({ title, value, icon, color }) => {
    const colorMap = {
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/50',
      green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50',
      yellow: 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/50',
      purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50'
    };
    const classes = colorMap[color];
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
        <div className={`p-3 rounded-full ${classes}`}>
          <Icon name={icon} className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    );
  };

  const handleGenerateSummary = () => {
    setIsSummaryLoading(true);
    setSummary('');
    // Simulação (agora com dados reais do Firestore)
    setTimeout(() => {
      setSummary(`✅ **Resumo Gerencial**\n\n- Total de processos: ${stats.total}\n- ${stats.taxa}% aprovados.\n- Processos em análise: ${stats.emAnalise}.\n- **Ação recomendada**: priorizar análise dos ${stats.emAnalise} processos em análise.`);
      setIsSummaryLoading(false);
    }, 1000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Início':
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Visão Geral do Gestor</h2>
              <button
                onClick={handleGenerateSummary}
                disabled={isSummaryLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition disabled:bg-purple-400 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50"
              >
                <Icon name="sparkles" className="w-4 h-4"/>
                {isSummaryLoading ? 'Gerando...' : 'Gerar Resumo Inteligente'}
              </button>
            </div>
            
            {/* Resumo Inteligente (WIP) ... */}
            {summary && (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-purple-200 dark:border-purple-700">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                  <Icon name="sparkles" className="w-5 h-5 mr-2 text-purple-600"/>
                  Resumo Inteligente
                </h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{summary}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total de Processos" value={stats.total} icon="folderKanban" color="blue" />
              <StatCard title="Processos Aprovados" value={stats.aprovados} icon="shieldCheck" color="green" />
              <StatCard title="Em Análise" value={stats.emAnalise} icon="clock" color="yellow" />
              <StatCard title="Taxa de Aprovação" value={`${stats.taxa}%`} icon="pieChart" color="purple" />
            </div>
            
            {/* Tabela de Processos do Gestor (nova) */}
            <GerenciadorProcessosGestor user={user} searchQuery={searchQuery} />
          </div>
        );
      case 'Processos':
        return <GerenciadorProcessosGestor user={user} searchQuery={searchQuery} />;
      case 'Relatórios':
        return <PlaceholderComponent title="Relatórios" />;
      case 'Ferramentas':
        return <FerramentasComponent user={user} />;
      case 'Configurações':
        return <SettingsComponent user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      default:
        return <PlaceholderComponent title="Página não encontrada" />;
    }
  };
  return <>{renderContent()}</>;
};

// --- Dashboard do ANALISTA (antigo Servidor) ---
const DashboardAnalistaComponent = ({ searchQuery = '', activeTab, user, darkMode, toggleDarkMode }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'Início':
        // Nova tela de Início para Analista
        return <AnalistaInicioComponent />;
      case 'Processos':
        // Novo componente de gerenciamento de processos
        return <GerenciadorProcessosAnalista user={user} searchQuery={searchQuery} />;
      case 'Ferramentas':
        return <FerramentasComponent user={user} />;
      case 'Configurações':
        // Adicionada a tela de Configurações
        return <SettingsComponent user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
      default:
        return <PlaceholderComponent title="Página não encontrada" />;
    }
  };
  return <>{renderContent()}</>;
};

// --- Dashboard do SUPORTE (antigo Visitante) ---
const DashboardSuporteComponent = ({ searchQuery = '', activeTab, user, darkMode, toggleDarkMode }) => {
  const renderContent = () => {
    switch(activeTab) {
      case 'Início':
        return (
          <PlaceholderComponent 
            title={`Bem-vindo, ${user.username}!`}
            message="Use a aba 'Tickets' para visualizar e gerenciar os chamados de suporte abertos."
          />
        );
      case 'Tickets':
        // Novo componente de gerenciamento de tickets
        return <GerenciadorTicketsComponent user={user} searchQuery={searchQuery} />;
      case 'Ferramentas':
        return <FerramentasComponent user={user} />;
      default:
        return <PlaceholderComponent title="Página não encontrada" />;
    }
  };
  return <>{renderContent()}</>;
};


// --- COMPONENTE PRINCIPAL APP (ATUALIZADO PARA FIREBASE) ---
const App = () => {
  const [view, setView] = useState('login');
  const [user, setUser] = useState(null); // Armazena dados do Firestore (nome, role, avatar, setor)
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('Início');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Efeito para login inicial (Custom Token ou Anônimo) e listener
  useEffect(() => {
    const performInitialSignIn = async () => {
      if (initialAuthToken) {
        try {
          await signInWithCustomToken(auth, initialAuthToken);
          // onAuthStateChanged fará o resto
        } catch (error) {
          console.error("Erro ao logar com Custom Token, tentando anônimo:", error);
          await signInAnonymously(auth);
        }
      } else {
        // Se não tiver token, loga anônimo (se a app permitir) ou espera login manual
        // Para esta app, vamos esperar o login manual
        // await signInAnonymously(auth); 
        // console.log("Logado anonimamente");
      }
    };
    
    // Inicia o listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && !firebaseUser.isAnonymous) {
        // Usuário está logado (não anônimo)
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            username: userData.fullName,
            role: userData.role,
            avatar: userData.avatar || `https://placehold.co/100x100/eeeeee/333333?text=${userData.fullName?.charAt(0) || '?'}`,
            email: firebaseUser.email,
            setor: userData.setor, // Adiciona setor ao estado do usuário
            registration: userData.registration // Adiciona matrícula
          });
          setActiveTab('Início'); // Reseta a aba para Início no login
          setView('dashboard');
        } else {
          // Usuário no Auth mas não no Firestore (ex: cadastro incompleto)
          console.error("Dados do usuário não encontrados no Firestore:", firebaseUser.uid);
          await signOut(auth);
          setUser(null);
          setView('login');
        }
      } else {
        // Usuário está deslogado ou anônimo
        setUser(null);
        setView('login');
      }
      setIsLoadingAuth(false);
    });

    // Tenta o login inicial
    performInitialSignIn().catch(console.error);

    return () => unsubscribe(); // Limpa o listener
  }, []); // Array vazio [] significa que este efeito roda apenas uma vez

  // Efeitos para Dark Mode
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // O listener onAuthStateChanged vai cuidar de resetar o estado e a view
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const renderDashboard = () => {
    if (!user) return null;

    let DashboardComponent;
    // Renderiza o dashboard com base no perfil (role)
    switch (user.role) {
      case 'Gestor': DashboardComponent = <DashboardGestorComponent />; break;
      case 'Analista': DashboardComponent = <DashboardAnalistaComponent />; break; // Antigo Servidor
      case 'Suporte': DashboardComponent = <DashboardSuporteComponent />; break; // Antigo Visitante
      default:
        console.warn("Role de usuário não reconhecido:", user.role);
        // Fallback para Analista se o role for indefinido (ex: 'Visitante' antigo)
        DashboardComponent = <DashboardAnalistaComponent />;
        // Atualiza o 'user' local para refletir o fallback (evita erros no Sidebar)
        user.role = 'Analista'; 
        break;
    }
    
    return (
      <DashboardLayout
        user={user}
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      >
        {DashboardComponent}
      </DashboardLayout>
    );
  };

  const renderView = () => {
    switch (view) {
      case 'login': return <LoginComponent onViewChange={setView} />;
      case 'register': return <RegisterComponent onViewChange={setView} />;
      case 'forgotPassword': return <ForgotPasswordComponent onViewChange={setView} />;
      case 'dashboard': return renderDashboard();
      default: return <LoginComponent onViewChange={setView} />;
    }
  };

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="flex items-center space-x-3">
          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600 dark:text-gray-300 text-lg">Carregando plataforma...</span>
        </div>
      </div>
    );
  }

  return renderView();
};

export default App;