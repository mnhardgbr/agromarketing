import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">AgroMarket</h3>
            <p className="text-gray-300">
              O maior marketplace de animais e equipamentos agropecuários do Brasil.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre" className="text-gray-300 hover:text-white">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-gray-300 hover:text-white">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/termos" className="text-gray-300 hover:text-white">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-gray-300 hover:text-white">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/animais/bovinos" className="text-gray-300 hover:text-white">
                  Bovinos
                </Link>
              </li>
              <li>
                <Link href="/animais/equinos" className="text-gray-300 hover:text-white">
                  Equinos
                </Link>
              </li>
              <li>
                <Link href="/animais/suinos" className="text-gray-300 hover:text-white">
                  Suínos
                </Link>
              </li>
              <li>
                <Link href="/equipamentos" className="text-gray-300 hover:text-white">
                  Equipamentos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">contato@agromarket.com.br</li>
              <li className="text-gray-300">(11) 99999-9999</li>
              <li className="text-gray-300">
                São Paulo - SP
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700">
          <p className="text-center text-gray-300">
            © {new Date().getFullYear()} AgroMarket. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 