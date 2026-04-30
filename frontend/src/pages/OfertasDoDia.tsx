import React from "react";
import "./OfertasDoDia.css"; // Importando o CSS

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Preço antigo cortado
  image_path: string;
  isOffer: boolean;
}

const OfertasDoDia: React.FC = () => {
  // Simulando os dados que viriam da sua API Laravel
  const ofertas: Product[] = [
    {
      id: 1,
      name: "Classic Burger",
      description:
        "Hambúrguer artesanal 180g, queijo cheddar, alface, tomate e molho especial",
      price: 18.9,
      originalPrice: 22.9,
      image_path: "caminho-da-imagem-1.jpg",
      isOffer: true,
    },
    {
      id: 2,
      name: "Hot Dog Tradicional",
      description:
        "Salsicha premium, purê, batata palha, milho, ervilha e molhos",
      price: 12.9,
      originalPrice: 15.9,
      image_path: "caminho-quebrado.jpg", // Exemplo para testar o fallback
      isOffer: true,
    },
    {
      id: 3,
      name: "Batata Frita",
      description: "Batata frita crocante sequinha",
      price: 9.9,
      originalPrice: 12.9,
      image_path: "caminho-da-imagem-3.jpg",
      isOffer: true,
    },
  ];

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";
  const fallbackImage = "/assets/placeholder-food.png"; // Coloque uma imagem padrão na pasta public

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    e.currentTarget.src = fallbackImage;
  };

  return (
    <section className="ofertas-section">
      <div className="ofertas-header">
        <h2>
          <span role="img" aria-label="fogo">
            🔥
          </span>{" "}
          Ofertas do Dia
        </h2>
        <a href="/ofertas" className="ver-todos">
          Ver todos &rarr;
        </a>
      </div>

      <div className="cards-grid">
        {ofertas.map((produto) => (
          <div key={produto.id} className="card-produto">
            <div className="card-image-container">
              <img
                src={`${backendUrl}/storage/${produto.image_path}`}
                alt={produto.name}
                onError={handleImageError}
                className="produto-img"
              />
              {produto.isOffer && <span className="badge-oferta">OFERTA!</span>}
            </div>

            <div className="card-content">
              <h3 className="produto-titulo">{produto.name}</h3>
              <p className="produto-descricao">{produto.description}</p>

              <div className="card-footer">
                <div className="preco-container">
                  {produto.originalPrice && (
                    <span className="preco-antigo">
                      R$ {produto.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="preco-atual">
                    R$ {produto.price.toFixed(2)}
                  </span>
                </div>
                <button className="btn-adicionar">+ Adicionar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OfertasDoDia;
