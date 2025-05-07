'use client';

import Link from 'next/link';

export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verifique seu Email
          </h2>
          <div className="mt-4">
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Um link de verificação foi enviado para seu email
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Por favor, verifique sua caixa de entrada e clique no link
                      para verificar seu endereço de email.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="text-sm text-gray-500 text-center">
                <p>Não recebeu o email?</p>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/auth/verify-email', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ email: sessionStorage.getItem('verifyEmail') }),
                      });

                      if (response.ok) {
                        alert('Email de verificação reenviado!');
                      } else {
                        alert('Erro ao reenviar email de verificação');
                      }
                    } catch (error) {
                      alert('Erro ao reenviar email de verificação');
                    }
                  }}
                  className="font-medium text-green-600 hover:text-green-500 ml-1"
                >
                  Reenviar email de verificação
                </button>
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