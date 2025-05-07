import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  const categories = [
    {
      name: 'Bovinos',
      href: '/animais/bovinos',
      image: '/images/bovinos.jpg',
    },
    {
      name: 'Equinos',
      href: '/animais/equinos',
      image: '/images/equinos.jpg',
    },
    {
      name: 'Suínos',
      href: '/animais/suinos',
      image: '/images/suinos.jpg',
    },
    {
      name: 'Equipamentos',
      href: '/equipamentos',
      image: '/images/equipamentos.jpg',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Bem-vindo ao</span>
            <span className="block text-green-600">AgroMarket</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            O marketplace ideal para compra e venda de animais.
          </p>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-green-600">
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.jpg"
            alt="Fundo do AgroMarket"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            O maior marketplace de animais e equipamentos agropecuários
          </h1>
          <p className="mt-6 text-xl text-white max-w-3xl">
            Compre e venda animais de forma segura e eficiente. Encontre os melhores equipamentos
            para sua propriedade rural.
          </p>
          <div className="mt-10">
            <Link
              href="/cadastro"
              className="inline-block bg-white py-3 px-8 border border-transparent rounded-md text-base font-medium text-green-600 hover:bg-gray-50"
            >
              Começar Agora
            </Link>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Categorias</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity duration-300">
                <div className="flex h-full items-center justify-center">
                  <h3 className="text-xl font-bold text-white">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Segurança Garantida</h3>
              <p className="text-gray-500">
                Todos os vendedores são verificados para garantir a segurança das transações.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chat Integrado</h3>
              <p className="text-gray-500">
                Negocie diretamente com os vendedores através do nosso sistema de chat.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Pagamento Seguro</h3>
              <p className="text-gray-500">
                Realize pagamentos de forma segura através da nossa plataforma.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
