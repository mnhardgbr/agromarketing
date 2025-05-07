'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Signin':
        return 'Tente fazer login com uma conta diferente.';
      case 'OAuthSignin':
        return 'Tente fazer login com uma conta diferente.';
      case 'OAuthCallback':
        return 'Tente fazer login com uma conta diferente.';
      case 'OAuthCreateAccount':
        return 'Tente fazer login com uma conta diferente.';
      case 'EmailCreateAccount':
        return 'Tente fazer login com uma conta diferente.';
      case 'Callback':
        return 'Tente fazer login com uma conta diferente.';
      case 'OAuthAccountNotLinked':
        return 'Para confirmar sua identidade, faça login com a mesma conta que você usou originalmente.';
      case 'EmailSignin':
        return 'Verifique seu endereço de email.';
      case 'CredentialsSignin':
        return 'Email ou senha incorretos.';
      case 'EmailVerification':
        return 'Por favor, verifique seu email antes de fazer login.';
      default:
        return 'Ocorreu um erro ao tentar fazer login.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Erro de Autenticação
          </h2>
          <div className="mt-4">
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {getErrorMessage(error)}
                  </h3>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-center">
              <Link
                href="/login"
                className="text-sm font-medium text-green-600 hover:text-green-500"
              >
                Voltar para o login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 