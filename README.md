# AgroMarketing Mobile

Aplicativo mobile para o marketplace AgroMarketing, desenvolvido com React Native e Expo.

## Funcionalidades

- Autenticação de usuários
- Listagem de animais e equipamentos
- Chat entre compradores e vendedores
- Perfil do usuário
- Upload de imagens
- Geolocalização

## Tecnologias

- React Native
- Expo
- TypeScript
- Firebase
- React Navigation

## Configuração do Ambiente

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

4. Para executar no emulador Android:
```bash
npm run android
```

5. Para executar no emulador iOS (requer macOS):
```bash
npm run ios
```

## Estrutura do Projeto

```
src/
  ├── screens/          # Telas do aplicativo
  ├── components/       # Componentes reutilizáveis
  ├── navigation/       # Configuração de navegação
  ├── services/         # Serviços e APIs
  ├── hooks/            # Hooks personalizados
  ├── utils/            # Funções utilitárias
  ├── assets/           # Recursos estáticos
  └── config/           # Configurações
```

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
