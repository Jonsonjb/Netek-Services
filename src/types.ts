export interface PedidoPlanta {
  id?: string;
  terrainDimensions: string;
  houseType: string; // "Tipo 1" | "Tipo 2" | "Tipo 3" | "Tipo 4"
  floors: number;
  roomsCount: number;
  livingRoomsCount: number;
  kitchensCount: number;
  porchesCount: number; // Varandas
  pantriesCount: number; // Dispensas
  materialType: "bloco_15" | "bloco_20";
  createdAt: number; // UTC timestamp
  clientEmail?: string;
  userId?: string;
  // Extended fields for custom solicitudes & door/window calculations
  clientName?: string;
  clientPhone?: string;
  doorsQty?: number;
  windowsQty?: number;
  requestedModifications?: string; // Message requested for customization
}

export interface VagaTrabalho {
  id?: string;
  title: string;
  category: string;
  neighborhood: string; // Bairro
  budget: number; // em MZN
  ownerContact: string; // Contacto original do dono da obra
  description: string;
  createdAt: number; // UTC timestamp
  userId: string;
  imageUrl?: string;
}

export interface PedidoCV {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  profession: string;
  experience: string;
  education: string;
  skills: string;
  objective: string;
  createdAt: number;
  userId: string;
}

export interface PedidoCarta {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  recipient: string; // Destinatário
  purpose: string; // Assunto
  bodyText: string;
  createdAt: number;
  userId: string;
}

export interface PedidoContrato {
  id?: string;
  clientName: string;
  clientIdNumber: string; // BI
  contractType: string;
  contractValue: number;
  details: string;
  createdAt: number;
  userId: string;
}

export interface Imovel {
  id?: string;
  title: string;
  type: "Venda" | "Aluguer";
  propertyType: "Terreno" | "Casa";
  dimensions: string;
  location: string;
  price: number; // em MZN
  duatStatus: "Com DUAT" | "Sem DUAT";
  description: string;
  createdAt: number;
  userId: string;
  imageUrl?: string;
}
