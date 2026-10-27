
import './estilos.css'

function ProdutoCard({
  foto,
  nome,
  categoria,
  preco,
  promoPrice,
  stock,
  quantidadeNoCarrinho = 0,
  onComprar,
}) {
  const disponivel = stock > 0 && quantidadeNoCarrinho < stock
  const esgotado = stock === 0
  const precoFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(preco / 100)
  const temPrecoPromocional = promoPrice !== undefined && promoPrice !== null
  const precoPromocionalFormatado = temPrecoPromocional
    ? new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(promoPrice / 100)
    : null

  return (
    <article className="produto-card">
      <img
        className="produto-card__foto"
        src={foto}
        alt={nome}
      />

      <div className="produto-card__conteudo">
        <span className="produto-card__categoria">
          {categoria}
        </span>

        <h2 className="produto-card__nome">{nome}</h2>
        {esgotado && (
          <span className="produto-card__selo-esgotado">Esgotado</span>
        )}

        <div className="produto-card__precos">
          {temPrecoPromocional && (
            <del className="produto-card__preco-original">
              {precoFormatado}
            </del>
          )}
          <p
            className={`produto-card__preco${temPrecoPromocional ? ' produto-card__preco--promocional' : ''}`}
          >
            {temPrecoPromocional ? precoPromocionalFormatado : precoFormatado}
          </p>
        </div>

        <button
          className="produto-card__botao"
          onClick={() => onComprar?.()}
          type="button"
          disabled={!disponivel}
        >
          {disponivel ? 'Comprar' : 'Indisponível'}
        </button>
      </div>
    </article>
  )
}

export default ProdutoCard
