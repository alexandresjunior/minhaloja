import './estilos.css'
import { NUMERO_WHATSAPP_LOJISTA } from '../../configuracao'

function formatarPreco(preco) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(preco / 100)
}

function criarMensagemPedido(itens, total) {
  const linhasItens = itens.map((item) => {
    const subtotal = item.precoUnitario * item.quantidade
    return `- ${item.name}: ${item.quantidade} x ${formatarPreco(item.precoUnitario)} = ${formatarPreco(subtotal)}`
  })

  return [
    'Olá! Gostaria de finalizar este pedido:',
    '',
    ...linhasItens,
    '',
    `Total: ${formatarPreco(total)}`,
  ].join('\n')
}

function Carrinho({
  itens,
  onAumentarQuantidade,
  onDiminuirQuantidade,
  onRemover,
}) {
  const quantidadeTotal = itens.reduce(
    (soma, item) => soma + item.quantidade,
    0,
  )
  const total = itens.reduce(
    (soma, item) => soma + item.precoUnitario * item.quantidade,
    0,
  )

  function finalizarPeloWhatsApp() {
    const mensagem = criarMensagemPedido(itens, total)
    const url = `https://wa.me/${NUMERO_WHATSAPP_LOJISTA}?text=${encodeURIComponent(mensagem)}`

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  if (itens.length === 0) {
    return (
      <main className="carrinho">
        <header className="carrinho-cabecalho">
          <h1>Meu carrinho</h1>
          <p>Confira os produtos que você escolheu.</p>
        </header>
        <p className="carrinho-vazio">Seu carrinho está vazio.</p>
        <section className="carrinho-resumo" aria-label="Resumo do carrinho">
          <p>Total de itens: {quantidadeTotal}</p>
          <p className="carrinho-total">Total: {formatarPreco(total)}</p>
        </section>
      </main>
    )
  }

  return (
    <main className="carrinho">
      <header className="carrinho-cabecalho">
        <h1>Meu carrinho</h1>
        <p>Confira os produtos que você escolheu.</p>
      </header>
      <ul className="carrinho-lista">
        {itens.map((item) => (
          <li className="carrinho-item" key={item.id}>
            <h2 className="carrinho-item__nome">{item.name}</h2>
            <p className="carrinho-item__preco">
              {formatarPreco(item.precoUnitario)} por unidade
            </p>
            <p className="carrinho-item__subtotal">
              Subtotal: {formatarPreco(item.precoUnitario * item.quantidade)}
            </p>
            <div className="carrinho-item__controles">
              <button
                aria-label={`Diminuir quantidade de ${item.name}`}
                disabled={item.quantidade <= 1}
                onClick={() => onDiminuirQuantidade(item.id)}
                type="button"
              >
                −
              </button>
              <span aria-live="polite">{item.quantidade}</span>
              <button
                aria-label={`Aumentar quantidade de ${item.name}`}
                disabled={item.quantidade >= item.stock}
                onClick={() => onAumentarQuantidade(item.id)}
                type="button"
              >
                +
              </button>
              <button
                className="carrinho-item__remover"
                onClick={() => onRemover(item.id)}
                type="button"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
      <section className="carrinho-resumo" aria-label="Resumo do carrinho">
        <p>Total de itens: {quantidadeTotal}</p>
        <p className="carrinho-total">Total: {formatarPreco(total)}</p>
      </section>
      <button
        className="carrinho-finalizar"
        onClick={finalizarPeloWhatsApp}
        type="button"
      >
        Finalizar pelo WhatsApp
      </button>
    </main>
  )
}

export default Carrinho
