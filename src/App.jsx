import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useParams,
} from 'react-router'

import Loja from './paginas/Loja'
import Carrinho from './paginas/Carrinho'
import MenuNavegacao from './componentes/MenuNavegacao'
import { useState } from 'react'

function ProdutoDetalhe() {
  const { id } = useParams()

  return (
    <main>
      <h1>Detalhes do produto</h1>
      <p>Produto selecionado: {id}</p>
      <Link to="/">Voltar à loja</Link>
    </main>
  )
}

function Admin() {
  return (
    <main>
      <h1>Administração de produtos</h1>

      <nav>
        <Link to="/admin/novo">Cadastrar produto</Link>
      </nav>
    </main>
  )
}

function NovoProduto() {
  return (
    <main>
      <h1>Novo produto</h1>
      <p>Formulário de cadastro será implementado aqui.</p>
    </main>
  )
}

function EditarProduto() {
  const { id } = useParams()

  return (
    <main>
      <h1>Editar produto</h1>
      <p>Produto a editar: {id}</p>
    </main>
  )
}

function NaoEncontrado() {
  return (
    <main>
      <h1>404 - Página não encontrada</h1>
      <p>O endereço informado não existe.</p>
      <Link to="/">Voltar à loja</Link>
    </main>
  )
}

function App() {
  const [itensCarrinho, setItensCarrinho] = useState([])
  const quantidadeItens = itensCarrinho.reduce(
    (soma, item) => soma + item.quantidade,
    0,
  )

  function adicionarAoCarrinho(produto) {
    if (!(produto.stock > 0)) {
      return
    }

    const precoUnitario = produto.promoPrice ?? produto.price

    setItensCarrinho((itensAtuais) => {
      const itemExistente = itensAtuais.find((item) => item.id === produto.id)

      if (itemExistente) {
        if (itemExistente.quantidade >= produto.stock) {
          return itensAtuais
        }

        return itensAtuais.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1, precoUnitario }
            : item,
        )
      }

      return [...itensAtuais, { ...produto, precoUnitario, quantidade: 1 }]
    })
  }

  function alterarQuantidade(produtoId, variacao) {
    setItensCarrinho((itensAtuais) =>
      itensAtuais.map((item) => {
        if (item.id !== produtoId) {
          return item
        }

        const quantidade = item.quantidade + variacao

        if (quantidade < 1 || quantidade > item.stock) {
          return item
        }

        return { ...item, quantidade }
      }),
    )
  }

  function removerDoCarrinho(produtoId) {
    setItensCarrinho((itensAtuais) =>
      itensAtuais.filter((item) => item.id !== produtoId),
    )
  }

  return (
    <BrowserRouter>
      <MenuNavegacao quantidadeItens={quantidadeItens} />
      <Routes>
        <Route
          path="/"
          element={
            <Loja
              itensCarrinho={itensCarrinho}
              onComprar={adicionarAoCarrinho}
            />
          }
        />

        <Route
          path="/produtos/:id"
          element={<ProdutoDetalhe />}
        />

        <Route
          path="/carrinho"
          element={
            <Carrinho
              itens={itensCarrinho}
              onAumentarQuantidade={(produtoId) =>
                alterarQuantidade(produtoId, 1)
              }
              onDiminuirQuantidade={(produtoId) =>
                alterarQuantidade(produtoId, -1)
              }
              onRemover={removerDoCarrinho}
            />
          }
        />

        <Route path="/admin" element={<Admin />} />

        <Route
          path="/admin/novo"
          element={<NovoProduto />}
        />

        <Route
          path="/admin/:id/editar"
          element={<EditarProduto />}
        />

        <Route path="*" element={<NaoEncontrado />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
