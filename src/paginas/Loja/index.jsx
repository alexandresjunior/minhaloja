
import { useEffect, useState } from 'react'
import './estilos.css'
import ProdutoCard from '../../componentes/ProdutoCard'

const API_URL = 'http://10.0.1.254:3000/products'

function Loja({ itensCarrinho, onComprar }) {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function buscarProdutos() {
      try {
        setCarregando(true)
        setErro('')

        const resposta = await fetch(API_URL, {
          signal: controller.signal,
        })

        if (!resposta.ok) {
          throw new Error('Não foi possível carregar os produtos.')
        }

        const dados = await resposta.json()
        setProdutos(dados)
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErro(error.message || 'Erro ao carregar os produtos.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false)
        }
      }
    }

    buscarProdutos()

    return () => controller.abort()
  }, [])

  if (carregando) {
    return <p className="loja-status">Carregando produtos...</p>
  }

  if (erro) {
    return (
      <div className="loja-status loja-erro" role="alert">
        <p>{erro}</p>
        <p>Erro de comunicação com o servidor.</p>
      </div>
    )
  }

  if (produtos.length === 0) {
    return (
      <p className="loja-status">
        Nenhum produto disponível no momento.
      </p>
    )
  }

  return (
    <main className="loja">
      <header className="loja-cabecalho">
        <h1>Nossa loja</h1>
        <p>Conheça nossos produtos artesanais.</p>
      </header>

      <section className="loja-grade" aria-label="Lista de produtos">
        {produtos.map((produto) => (
          <ProdutoCard
            key={produto.id}
            nome={produto.name}
            foto={produto.image}
            categoria={produto.category}
            preco={produto.price}
            promoPrice={produto.promoPrice}
            stock={produto.stock}
            quantidadeNoCarrinho={
              itensCarrinho.find((item) => item.id === produto.id)?.quantidade ?? 0
            }
            onComprar={() => onComprar(produto)}
          />
        ))}
      </section>
    </main>
  )
}

export default Loja
