% npm create vite@latest
para criar um development server


jsx = javscript xml file
src/main.jsx = file principal do projeto
react works with components, wich we import on the main.jsx

index.css = main css file for our application in wich we import onto the main.sjx

the app component serves as the root, in which we add other components into it

## configurar axios

npm install axios

src/services/api.ts 

const api = axios.create({
    base.timeout : 5000;
    baseUrl : 'http;//localhost:3000'
    headers: {
        'Content-Type':'application/json'
    }
})

## Sessão

após criar o usuário, a api deve gerar um jwt token, contendo o id e role do usuário criptografados

armazena os dados nos http-only cookies

No react, o ideal é usar um provider

// AuthContext.js (Resumo)
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData); // Aqui você salva { id, role, nome }
    localStorage.setItem('@ChatApp:user', JSON.stringify(userData));
  };

  <!-- return (
    <AuthContext.Provider value={{ user, login }}>
      {children}
    </AuthContext.Provider>
  );
} -->