import { Product } from "../types/product";

export const products: Product[] = [
  // --- BURGERS ---
  {
    id: "b1",
    name: "Classic Burger",
    price: 18.9,
    originalPrice: 22.9,
    category: "burger",
    image:
      "https://st4.depositphotos.com/6437402/30960/i/1600/depositphotos_309600474-stock-photo-craft-beef-burger.jpg",
    description:
      "Hambúrguer artesanal 180g, queijo cheddar, alface, tomate e molho especial",
  },
  {
    id: "b2",
    name: "Bacon Deluxe",
    price: 24.9,
    category: "burger",
    image:
      "https://images.unsplash.com/photo-1553979459-d2229ba7433b?q=80&w=800",
    description:
      "Duplo hambúrguer, bacon crocante, cheddar, cebola caramelizada",
  },
  {
    id: "b3",
    name: "Mushroom Swiss",
    price: 26.9,
    category: "burger",
    image:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800",
    description:
      "Hambúrguer premium, queijo suíço, cogumelos salteados, rúcula",
  },
  {
    id: "b4",
    name: "BBQ Special",
    price: 22.9,
    category: "burger",
    image:
      "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=800",
    description:
      "Hambúrguer defumado, molho barbecue, onion rings, queijo cheddar",
  },
  {
    id: "b5",
    name: "Monster Tenacious",
    price: 38.9,
    originalPrice: 45.9,
    category: "burger",
    image:
      "https://images.unsplash.com/photo-1582196016295-f8c499b3a7fc?q=80&w=800",
    description: "Triplo burger, triplo cheddar, ovo, bacon e picles artesanal",
  },
  {
    id: "b6",
    name: "Chicken Crisp",
    price: 21.9,
    category: "burger",
    image:
      "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?q=80&w=800",
    description:
      "Sobrecoxa de frango empanada, maionese de ervas e alface americana",
  },

  // --- DOGS ---
  {
    id: "d1",
    name: "Hot Dog Tradicional",
    price: 12.9,
    originalPrice: 15.9,
    category: "dog",
    image:
      "https://images.unsplash.com/photo-1541214113241-21578d2d9b62?q=80&w=800",
    description:
      "Salsicha premium, purê, batata palha, milho, ervilha e molhos",
  },
  {
    id: "d2",
    name: "Hot Dog Especial",
    price: 16.9,
    category: "dog",
    image:
      "https://images.unsplash.com/photo-1627054248949-21f77275a15f?q=80&w=880",
    description: "Salsicha artesanal, catupiry, bacon, cheddar e batata palha",
  },
  {
    id: "d3",
    name: "Hot Dog Completo",
    price: 19.9,
    category: "dog",
    image:
      "https://images.unsplash.com/photo-1768250708137-e087bbabe20c?q=80&w=1170",
    description:
      "Dupla salsicha, purê, bacon, catupiry, cheddar, todos os molhos",
  },

  // --- SIDES ---
  {
    id: "s1",
    name: "Batata Frita",
    price: 9.9,
    category: "side",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=800",
    description: "Batata frita crocante sequinha",
  },
  {
    id: "s2",
    name: "Onion Rings",
    price: 11.9,
    category: "side",
    image:
      "https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=800",
    description: "Anéis de cebola empanados e fritos",
  },
  {
    id: "s3",
    name: "Nuggets",
    price: 13.9,
    category: "side",
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800",
    description: "10 unidades de nuggets crocantes",
  },
  {
    id: "s4",
    name: "Refrigerante Lata",
    price: 5.0,
    category: "drink",
    image:
      "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?q=80&w=800",
    description: "Refrigerante lata 350ml (Cola, Guaraná, Limão ou Laranja)",
  },
  {
    id: "d5",
    name: "Suco Natural",
    price: 8.9,
    category: "drink",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbYtxswU4aa3jNAt1PjOKR0hO7mfvBF_FkfA&s",
    description:
      "Suco natural feito na hora, escolha entre laranja ou maracujá",
  },
  {
    id: "d6",
    name: "Cerveja Long Neck",
    price: 11.9,
    category: "drink",
    image: "https://www.moneytimes.com.br/uploads/2019/08/cerveja-ambev-.jpg",
    description: "Cerveja gelada Long Neck para acompanhar seu pedido",
  },

  // --- COMBOS ---
  {
    id: "c1",
    name: "Combo Catarinense",
    price: 79.9,
    originalPrice: 95.0,
    category: "combo",
    image:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=800",
    description: "2 Classic Burgers + Batata G + Refri 2L",
  },
  {
    id: "c2",
    name: "Dupla Tenacious",
    price: 45.9,
    originalPrice: 58.0,
    category: "combo",
    image:
      "https://images.unsplash.com/photo-1521305916504-4a1121188589?q=80&w=800",
    description: "2 Monster Tenacious pelo preço especial",
  },
];

export const menuPorUnidade: Record<string, string[]> = {
  "Rio do Sul": products.map((p) => p.id),
  Atalanta: ["b1", "b2", "b4", "d1", "s1", "s4"],
  Ituporanga: ["b1", "b2", "b3", "b5", "d2", "d3", "s1", "s2", "s4"],
  Agrolândia: ["b1", "b2", "b6", "d1", "s1", "s4"],
  Laurentino: ["b1", "b2", "b4", "b5", "d1", "d2", "s1", "s4"],
  "Trombudo Central": ["b1", "b2", "b3", "d1", "s1", "s4"],
};

export const dailyOffers = products.filter(
  (p) => p.originalPrice && p.originalPrice > p.price,
);

export const promoCombos = products.filter((p) => p.category === "combo");
