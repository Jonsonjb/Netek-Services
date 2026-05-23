/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Course {
  id: string;
  title: string;
  slug: string;
  category: 'Operações e Energia' | 'Manutenção Industrial' | 'Tecnologia' | 'Construção e Logística';
  duration: number; // in hours
  description: string;
  targetAudience: string[];
  prerequisites: string;
  educationRequired: string; // e.g., "Ensino Primário completo", "9ª Classe completa", "12ª Classe completa"
  modality: 'Presencial' | 'Semipresencial';
  marketDemand: string; // Context for Mozambique (e.g., Projects in Coral Sul, Temane, Nacala Corridor, Cabo Delgado)
  syllabus: string[];
  provincesAvailable: string[]; // list of Mozambican provinces e.g. ["Cabo Delgado", "Maputo Cidade", "Sofala"]
}

export interface ProvinceData {
  id: string;
  name: string;
  hubs: {
    district: string;
    institution: string;
    address: string;
    spots: number;
    courses: string[]; // Course IDs
  }[];
}

export interface Registration {
  id: string;
  fullName: string;
  birthday: string;
  gender: 'Masculino' | 'Feminino' | 'Outro';
  biNumber: string; // Documento de Identidade de Moçambique (BI)
  nuit: string; // NUIT (Número Único de Identificação Tributária)
  phone: string;
  email: string;
  province: string;
  district: string;
  childUnder11: boolean; // Relevant to see if they get the increased stipend (10.500 MZN vs 8.000 MZN)
  educationLevel: string;
  courseId: string;
  agreeToTerms: boolean;
  status: 'Em Processamento' | 'Pré-Selecionado' | 'Documentação Pendente' | 'Matriculado' | 'Suplente';
  registrationDate: string;
  protocolNumber: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'Geral' | 'Inscrições' | 'Bolsas e Auxílios' | 'Moçambique';
}
