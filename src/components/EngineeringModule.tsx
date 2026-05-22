import React, { useState } from "react";
import { motion } from "motion/react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "../firebase";
import { jsPDF } from "jspdf";
import {
  Calculator,
  ChevronRight,
  ChevronLeft,
  Ruler,
  Home,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  Grid,
  Settings,
  Phone,
  Layout,
  Mail,
  Check,
  FileDown,
} from "lucide-react";
import { PedidoPlanta } from "../types";

interface CustomRoom {
  id: string;
  name: string;
  type: "bedroom" | "suite" | "living" | "kitchen" | "bathroom" | "porch" | "garage" | "pantry" | "custom";
  width: number; // in meters
  length: number; // in meters
}

export default function EngineeringModule({ isAdmin }: { isAdmin: boolean }) {
  const [step, setStep] = useState(1); // 1: Setup/Template, 2: Interactive Designer, 3: Material Calculations
  const [terrainDimensions, setTerrainDimensions] = useState("12x30");
  const [houseType, setHouseType] = useState("Tipo 2");
  const [floors, setFloors] = useState(1);
  const [materialType, setMaterialType] = useState<"bloco_15" | "bloco_20">("bloco_15");
  const [clientEmail, setClientEmail] = useState("");

  // Interactive custom designed rooms
  const [rooms, setRooms] = useState<CustomRoom[]>([
    { id: "r1", name: "Quarto Principal", type: "bedroom", width: 4.0, length: 3.5 },
    { id: "r2", name: "Quarto de Hóspedes", type: "bedroom", width: 3.5, length: 3.0 },
    { id: "r3", name: "Sala de Estar", type: "living", width: 5.0, length: 4.0 },
    { id: "r4", name: "Cozinha Moderna", type: "kitchen", width: 3.5, length: 3.5 },
    { id: "r5", name: "Casinha de Banho", type: "bathroom", width: 2.5, length: 2.0 },
    { id: "r6", name: "Varanda Frontal", type: "porch", width: 3.0, length: 1.5 },
  ]);

  const [selectedBlueprintRoomId, setSelectedBlueprintRoomId] = useState<string | null>(null);

  const currentActiveRoomId = selectedBlueprintRoomId || (rooms.length > 0 ? rooms[0].id : null);
  const currentActiveRoom = rooms.find(r => r.id === currentActiveRoomId);

  const [isLoading, setIsLoading] = useState(false);
  const [isCalculated, setIsCalculated] = useState(false);
  
  // Custom solicitation details & forms
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [requestedModifications, setRequestedModifications] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  const [results, setResults] = useState<{
    concreteVolume: number;
    blocksCount: number;
    cementBags: number;
    sandVolume: number;
    stoneVolume: number;
    totalArea: number;
    wallLength: number;
    doorsCount: number;
    windowsCount: number;
    doorsList: { name: string; size: string; qty: number }[];
    windowsList: { name: string; size: string; qty: number }[];
  } | null>(null);

  // Mozambican Templates Setup
  const applyPresetTemplate = (preset: string) => {
    setHouseType(preset);
    if (preset === "Tipo 1") {
      setRooms([
        { id: "p1", name: "Quarto", type: "bedroom", width: 4.0, length: 3.0 },
        { id: "p2", name: "Sala de Estar", type: "living", width: 4.0, length: 4.0 },
        { id: "p3", name: "Cozinha", type: "kitchen", width: 3.0, length: 3.0 },
        { id: "p4", name: "Casinha de Banho", type: "bathroom", width: 2.0, length: 2.0 },
      ]);
    } else if (preset === "Tipo 2") {
      setRooms([
        { id: "p1", name: "Suite Casal", type: "suite", width: 4.0, length: 3.5 },
        { id: "p2", name: "Quarto Júnior", type: "bedroom", width: 3.5, length: 3.0 },
        { id: "p3", name: "Sala de Estar/Jantar", type: "living", width: 5.0, length: 4.0 },
        { id: "p4", name: "Cozinha", type: "kitchen", width: 3.5, length: 3.0 },
        { id: "p5", name: "Casinha de Banho Comum", type: "bathroom", width: 2.5, length: 2.0 },
        { id: "p6", name: "Varanda Frontal", type: "porch", width: 4.0, length: 1.5 },
      ]);
    } else if (preset === "Tipo 3") {
      setRooms([
        { id: "p1", name: "Suite Principal", type: "suite", width: 4.5, length: 4.0 },
        { id: "p2", name: "Quarto de Solteiro 1", type: "bedroom", width: 3.5, length: 3.5 },
        { id: "p3", name: "Quarto de Solteiro 2", type: "bedroom", width: 3.5, length: 3.0 },
        { id: "p4", name: "Sala de Visitas Espaçosa", type: "living", width: 6.0, length: 4.5 },
        { id: "p5", name: "Cozinha com Copa", type: "kitchen", width: 4.0, length: 3.5 },
        { id: "p6", name: "W.C. Geral", type: "bathroom", width: 2.5, length: 2.0 },
        { id: "p7", name: "Dispensa", type: "pantry", width: 2.0, length: 2.0 },
        { id: "p8", name: "Varanda Larga", type: "porch", width: 4.5, length: 2.0 },
      ]);
    } else if (preset === "Tipo 4") {
      setRooms([
        { id: "p1", name: "Suite Presidential", type: "suite", width: 5.0, length: 4.5 },
        { id: "p2", name: "Suite Júnior", type: "suite", width: 4.0, length: 3.5 },
        { id: "p3", name: "Quarto Infantil", type: "bedroom", width: 3.5, length: 3.5 },
        { id: "p4", name: "Sala de Estar Nobre", type: "living", width: 6.5, length: 5.0 },
        { id: "p5", name: "Sala de Jantar", type: "living", width: 4.5, length: 3.5 },
        { id: "p6", name: "Cozinha Gourmet", type: "kitchen", width: 4.0, length: 4.0 },
        { id: "p7", name: "Garagem Privativa", type: "garage", width: 6.0, length: 4.0 },
        { id: "p8", name: "Varanda Panorâmica", type: "porch", width: 6.0, length: 2.5 },
        { id: "p9", name: "W.C. Social", type: "bathroom", width: 2.5, length: 2.0 },
        { id: "p10", name: "Dispensa/Lavandaria", type: "pantry", width: 3.0, length: 2.0 },
      ]);
    }
  };

  // Helper colors for blueprint visual representation
  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case "bedroom": return "bg-sky-500/20 text-sky-400 border-sky-500/30";
      case "suite": return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
      case "living": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "kitchen": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "bathroom": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      case "porch": return "bg-teal-500/20 text-teal-400 border-teal-500/30";
      case "garage": return "bg-slate-500/20 text-slate-400 border-slate-500/30";
      case "pantry": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // Function to add a dynamic room to our blueprint
  const appendRoom = (type: "bedroom" | "suite" | "living" | "kitchen" | "bathroom" | "porch" | "garage" | "pantry") => {
    const counts = rooms.filter(r => r.type === type).length;
    let label = "";
    let w = 3.5;
    let l = 3.0;

    switch (type) {
      case "bedroom": label = `Quarto ${counts + 1}`; w = 3.5; l = 3.0; break;
      case "suite": label = `Suite ${counts + 1}`; w = 4.0; l = 3.5; break;
      case "living": label = `Sala ${counts + 1}`; w = 4.5; l = 4.0; break;
      case "kitchen": label = `Cozinha ${counts + 1}`; w = 3.5; l = 3.5; break;
      case "bathroom": label = `W.C. ${counts + 1}`; w = 2.0; l = 2.0; break;
      case "porch": label = `Varanda ${counts + 1}`; w = 3.0; l = 1.5; break;
      case "garage": label = `Garagem ${counts + 1}`; w = 6.0; l = 3.5; break;
      case "pantry": label = `Copa/Dispensa`; w = 2.0; l = 2.0; break;
    }

    const newRoom: CustomRoom = {
      id: `${type}-${Date.now()}`,
      name: label,
      type,
      width: w,
      length: l,
    };
    setRooms([...rooms, newRoom]);
  };

  const removeRoom = (id: string) => {
    setRooms(rooms.filter((r) => r.id !== id));
  };

  const updateRoomDimension = (id: string, field: "width" | "length", increment: boolean) => {
    setRooms(rooms.map(r => {
      if (r.id === id) {
        const delta = increment ? 0.5 : -0.5;
        const currentVal = r[field];
        const newVal = Math.max(1.5, Math.min(10.0, currentVal + delta));
        return { ...r, [field]: newVal };
      }
      return r;
    }));
  };

  // Live Blueprint calculations
  const calculateTotalArea = () => {
    return rooms.reduce((total, r) => total + (r.width * r.length), 0);
  };

  const calculateLinearWalls = () => {
    // Estimating the linear length of walls including inner divisions
    // Standard rule: 2 * (W + L) per room, but we consolidate partition overlap (factor in 30% discount)
    const rawPerimetersSum = rooms.reduce((sum, r) => sum + (2 * (r.width + r.length)), 0);
    return Math.ceil(rawPerimetersSum / 1.35); // Consolidation factor for shared walls
  };

  const handleDownloadEngineeringPDF = () => {
    if (!results) return;
    try {
      const doc = new jsPDF();
      
      // Header Banner
      doc.setFillColor(44, 62, 80); // #2c3e50 Deep Slate
      doc.rect(0, 0, 210, 38, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(17);
      doc.text("NETEK SERVICES - ENGENHARIA CIVIL", 14, 16);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.text("Portal Tecnico de Metricas de Construcao em Mocambique", 14, 23);
      doc.text("Diretor Geral: Jonson Bernardo Francisco (Jonson JB7) | Tel: +258 83 510 9190", 14, 28);
      
      // Covered Area Status badge shape
      doc.setFillColor(255, 102, 0); // #ff6600 Orange
      doc.rect(142, 10, 54, 18, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("AREA COBERTA", 146, 16);
      doc.setFontSize(12);
      doc.text(`${results.totalArea} m2`, 146, 23);

      // Report Header title
      doc.setTextColor(44, 62, 80);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("RELATORIO DE ESTIMATIVA DE MATERIAIS DE ALVENARIA", 14, 48);

      doc.setDrawColor(200, 200, 200);
      doc.line(14, 52, 196, 52);

      // Metadata layout
      doc.setTextColor(80, 80, 80);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      
      doc.setFont("helvetica", "bold");
      doc.text("Modelo de Vivenda:", 14, 60);
      doc.setFont("helvetica", "normal");
      doc.text(`${houseType}`, 52, 60);

      doc.setFont("helvetica", "bold");
      doc.text("Lote / Terreno:", 14, 66);
      doc.setFont("helvetica", "normal");
      doc.text(`${terrainDimensions} metros`, 52, 66);

      doc.setFont("helvetica", "bold");
      doc.text("Pisos Planeados:", 14, 72);
      doc.setFont("helvetica", "normal");
      doc.text(`${floors} Piso(s)`, 52, 72);

      doc.setFont("helvetica", "bold");
      doc.text("Tipo de Alvenaria:", 14, 78);
      doc.setFont("helvetica", "normal");
      doc.text(`${materialType === "bloco_15" ? "Bloco Cimento 15cm" : "Bloco Cimento 20cm"}`, 52, 78);

      doc.setFont("helvetica", "bold");
      doc.text("Data de Registo:", 14, 84);
      doc.setFont("helvetica", "normal");
      doc.text(`${new Date().toLocaleDateString("pt-MZ")} as ${new Date().toLocaleTimeString("pt-MZ")}`, 52, 84);

      // Materials Table Header
      doc.setFillColor(242, 245, 248);
      doc.rect(14, 91, 182, 8, "F");
      
      doc.setTextColor(44, 62, 80);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9.5);
      doc.text("INSUMO / MATERIAL", 18, 96);
      doc.text("QUANTIDADE ESTIMADA", 100, 96);
      doc.text("TIPO / CARACTERISTICA", 152, 96);

      doc.setDrawColor(210, 215, 225);
      doc.line(14, 99, 196, 99);

      // Material details lists
      const materials = [
        { name: "Cimento CP32.5/42.5", qty: `${results.cementBags} Sacos`, spec: "Sacos de 50kg Nacional" },
        { name: "Blocos de Cimento Vibrado", qty: `${results.blocksCount} Unidades`, spec: `Parede de ${materialType === "bloco_15" ? "15cm" : "20cm"} (+12% perdas)` },
        { name: "Areia Grossa/Fina", qty: `${results.sandVolume} m3`, spec: "Argamassas e Rebocos" },
        { name: "Pedra Britada / Brita", qty: `${results.stoneVolume} m3`, spec: "Brita 1 e 2 para Betonagem" },
        { name: "Betao Liquido Estrutural", qty: `${results.concreteVolume} m3`, spec: "Pilares, Vigas, Baldrame" },
        { name: "Trabalhos de Portaria", qty: `${results.doorsCount} Portas`, spec: "Vaos de acesso dimensionados" },
        { name: "Trabalhos de Vidraria", qty: `${results.windowsCount} Janelas`, spec: "Vaos de esquadrias previstos" }
      ];

      let currentY = 105;
      materials.forEach((mat) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.text(mat.name, 18, currentY);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(44, 62, 80);
        doc.text(mat.qty, 100, currentY);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(110, 110, 110);
        doc.text(mat.spec, 152, currentY);
        
        doc.line(14, currentY + 3, 196, currentY + 3);
        currentY += 8;
      });

      // Compartments section
      doc.setTextColor(44, 62, 80);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("PLANILHA DE COMPARTIMENTOS CONFIGURADOS", 14, currentY + 5);
      currentY += 11;

      rooms.forEach((room, index) => {
        if (currentY > 265) {
          doc.addPage();
          currentY = 20;
        }
        
        doc.setFillColor(248, 249, 250);
        doc.rect(14, currentY - 4, 182, 7, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(44, 62, 80);
        doc.text(`${index + 1}. ${room.name}`, 18, currentY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(`Dimensoes: ${room.width.toFixed(1)}m x ${room.length.toFixed(1)}m`, 95, currentY);
        doc.setFont("helvetica", "bold");
        doc.text(`Area: ${(room.width * room.length).toFixed(1)} m2`, 160, currentY);

        currentY += 8;
      });

      // Detailed esquadrias
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      doc.setDrawColor(200, 200, 200);
      doc.line(14, currentY, 196, currentY);
      currentY += 8;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.5);
      doc.setTextColor(44, 62, 80);
      doc.text("DIMENSIONAMENTO SUGERIDO PARA PORTAS E JANELAS", 14, currentY);
      currentY += 6;

      results.doorsList.forEach((door, idx) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(70, 70, 70);
        doc.text(`Porta: ${door.name} (${door.size})`, 18, currentY);
        doc.setFont("helvetica", "bold");
        doc.text(`${door.qty} Vao(s)`, 152, currentY);
        currentY += 5.5;
      });

      results.windowsList.forEach((win, idx) => {
        if (currentY > 270) {
          doc.addPage();
          currentY = 20;
        }
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(70, 70, 70);
        doc.text(`Janela: ${win.name} (${win.size})`, 18, currentY);
        doc.setFont("helvetica", "bold");
        doc.text(`${win.qty} Vao(s)`, 152, currentY);
        currentY += 5.5;
      });

      currentY += 6;

      // Note and signature section
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFillColor(255, 253, 242);
      doc.rect(14, currentY, 182, 22, "F");
      doc.setDrawColor(255, 215, 0);
      doc.rect(14, currentY, 182, 22, "S");

      doc.setTextColor(110, 80, 5);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text("DECLARACAO DE LIMITACAO DE RESPONSABILIDADE (RGEU):", 18, currentY + 5);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(130, 95, 10);
      doc.text("As metricas exibidas baseiam-se em coeficientes consagrados no regulamento de edificacoes de Mocambique.", 18, currentY + 10);
      doc.text("O uso real de cimento e areia pode oscilar conforme técnicas aplicadas. Recomenda-se validacao por Engenheiro.", 18, currentY + 14);
      doc.text("Coordenador-Geral Netek Services: Jonson Bernardo Francisco (Jonson JB7)", 18, currentY + 18);

      // Simple footer watermark
      doc.setTextColor(165, 175, 185);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.text("Documento autenticado digitalmente e emitido pelo Portal Netek Services.", 14, 285);

      doc.save(`Netek_Report_Materiais_${houseType.replace(/\s+/g, "_")}.pdf`);
    } catch (e) {
      console.error("Erro ao gerar PDF de engenharia:", e);
    }
  };

  // Submit & compute the full construction materials based on actual floor plan rooms!
  const handleCalculateAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormSuccess(false); // Reset solicitation success flag

    const floorPlanArea = calculateTotalArea();
    const resolvedFloors = floors;
    const finalTotalBuildArea = floorPlanArea * resolvedFloors;
    const finalWallLength = calculateLinearWalls();

    // Standard structural sizing under Mozambican standards:
    // 1. Concrete (Volume de Betão em m³): includes foundation slab (15cm), footings, colunas e vigas
    const concreteVolume = Number((finalTotalBuildArea * 0.24).toFixed(1)); 

    // 2. Wall Area (Área total de paredes em m²): linear perimeter * 3m wall height per floor
    const wallArea = finalWallLength * 3.0 * resolvedFloors;

    // 3. Blocks/Bricks Count (Quantidade aproximada de Blocos)
    // 15cm block uses roughly 12.5 blocks/m² of wall
    // 20cm block uses roughly 14.5 blocks/m² of wall
    const density = materialType === "bloco_15" ? 12.5 : 14.5;
    const blocksCount = Math.ceil(wallArea * density * 1.12); // with 12% breakage buffer for transportation

    // 4. Cement Bags of 50kg (Sacos de Cimento)
    // ~7.5 bags per m³ for concrete structures, plus ~0.48 bags per m² of wall for laying/plastering (reboco)
    const cementBags = Math.ceil((concreteVolume * 7.5) + (wallArea * 0.48));

    // 5. Sand volume in m³ (Areia fina e grossa)
    const sandVolume = Number(((concreteVolume * 0.44) + (wallArea * 0.024)).toFixed(1));

    // 6. Stone volume in m³ (Pedra britada para betão de fundações)
    const stoneVolume = Number((concreteVolume * 0.82).toFixed(1));

    // 7. Core computation of doors and windows parameters
    let extDoorsQty = 0;
    let intDoorsQty = 0;
    let bathDoorsQty = 0;
    let garageGatesQty = 0;

    let largeWindowsQty = 0;
    let mediumWindowsQty = 0;
    let smallWindowsQty = 0;

    rooms.forEach((r) => {
      if (r.type === "bedroom") {
        intDoorsQty += 1;
        mediumWindowsQty += 1;
      } else if (r.type === "suite") {
        intDoorsQty += 1; // Door entering the suite
        bathDoorsQty += 1; // Door entering suite restroom
        mediumWindowsQty += 1;
        smallWindowsQty += 1;
      } else if (r.type === "living") {
        extDoorsQty += 1; // Main front double door
        largeWindowsQty += 2; // High luminosity
      } else if (r.type === "kitchen") {
        extDoorsQty += 1; // Kitchen patio access door
        mediumWindowsQty += 1;
      } else if (r.type === "bathroom") {
        intDoorsQty += 1;
        smallWindowsQty += 1;
      } else if (r.type === "porch") {
        // Front screen porch, doesn't add interior doors
      } else if (r.type === "garage") {
        garageGatesQty += 1;
        intDoorsQty += 1; // Internal access foyer
        smallWindowsQty += 1;
      } else if (r.type === "pantry") {
        intDoorsQty += 1;
        smallWindowsQty += 1;
      } else {
        intDoorsQty += 1;
        mediumWindowsQty += 1;
      }
    });

    if (extDoorsQty === 0) extDoorsQty = 1; // Safeguard

    const doorsCount = extDoorsQty + intDoorsQty + bathDoorsQty + garageGatesQty;
    const windowsCount = largeWindowsQty + mediumWindowsQty + smallWindowsQty;

    const doorsList = [
      ...(extDoorsQty > 0 ? [{ name: "Portas Externas (Madeira Nobre/Sliding)", size: "0.90m x 2.10m", qty: extDoorsQty }] : []),
      ...(intDoorsQty > 0 ? [{ name: "Portas Interiores (Madeira MDF)", size: "0.80m x 2.10m", qty: intDoorsQty }] : []),
      ...(bathDoorsQty > 0 ? [{ name: "Portas Sanitárias (MDF Termoresistente)", size: "0.70m x 2.10m", qty: bathDoorsQty }] : []),
      ...(garageGatesQty > 0 ? [{ name: "Portões Metálicos de Garagem", size: "2.40m x 2.10m", qty: garageGatesQty }] : []),
    ];

    const windowsList = [
      ...(largeWindowsQty > 0 ? [{ name: "Janelas de Sala Inteiras (Alumínio/Vidro)", size: "1.50m x 1.25m", qty: largeWindowsQty }] : []),
      ...(mediumWindowsQty > 0 ? [{ name: "Janelas Quartos & Cozinhas", size: "1.20m x 1.20m", qty: mediumWindowsQty }] : []),
      ...(smallWindowsQty > 0 ? [{ name: "Janelas Basculantes do Sanitário", size: "0.60m x 0.60m", qty: smallWindowsQty }] : []),
    ];

    const computedResults = {
      concreteVolume,
      blocksCount,
      cementBags,
      sandVolume,
      stoneVolume,
      totalArea: finalTotalBuildArea,
      wallLength: finalWallLength,
      doorsCount,
      windowsCount,
      doorsList,
      windowsList,
    };

    setResults(computedResults);

    // Save calculation request to database (pedidos_plantas)
    const emailToUse = clientEmail || auth.currentUser?.email || "utilizador.teste@netekservices.co.mz";
    
    // Convert current custom rooms counts to standard variables to remain backward compatible with DB schema
    const roomsCount = rooms.filter(r => r.type === "bedroom" || r.type === "suite").length;
    const livingRoomsCount = rooms.filter(r => r.type === "living").length;
    const kitchensCount = rooms.filter(r => r.type === "kitchen").length;
    const porchesCount = rooms.filter(r => r.type === "porch").length;
    const pantriesCount = rooms.filter(r => r.type === "pantry" || r.type === "garage").length;

    const payload: PedidoPlanta = {
      terrainDimensions,
      houseType,
      floors: resolvedFloors,
      roomsCount,
      livingRoomsCount,
      kitchensCount,
      porchesCount,
      pantriesCount,
      materialType,
      clientEmail: emailToUse,
      createdAt: Date.now(),
      userId: auth.currentUser?.uid || "anonimo",
      doorsQty: doorsCount,
      windowsQty: windowsCount,
    };

    try {
      await addDoc(collection(db, "pedidos_plantas"), payload);
      setIsCalculated(true);
      setStep(3); // Transit to results presentation window!
    } catch (err: any) {
      console.error("Erro ao submeter planta no Firebase Firestore:", err);
      try {
        handleFirestoreError(err, OperationType.CREATE, "pedidos_plantas");
      } catch (wrapped) {
        // Fallback local visual activation
        setIsCalculated(true);
        setStep(3);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const [isSendingMsg, setIsSendingMsg] = useState(false);

  const handleDirectMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      alert("Por favor preencha o seu nome e contacto telefónico.");
      return;
    }

    setIsSendingMsg(true);

    try {
      const emailToUse = clientEmail || auth.currentUser?.email || "utilizador.teste@netekservices.co.mz";
      
      const roomsCount = rooms.filter(r => r.type === "bedroom" || r.type === "suite").length;
      const livingRoomsCount = rooms.filter(r => r.type === "living").length;
      const kitchensCount = rooms.filter(r => r.type === "kitchen").length;
      const porchesCount = rooms.filter(r => r.type === "porch").length;
      const pantriesCount = rooms.filter(r => r.type === "pantry" || r.type === "garage").length;

      const fullPayload = {
        terrainDimensions,
        houseType,
        floors,
        roomsCount,
        livingRoomsCount,
        kitchensCount,
        porchesCount,
        pantriesCount,
        materialType,
        clientEmail: emailToUse,
        clientName,
        clientPhone,
        doorsQty: results?.doorsCount || 0,
        windowsQty: results?.windowsCount || 0,
        requestedModifications,
        createdAt: Date.now(),
        userId: auth.currentUser?.uid || "anonimo",
      };

      await addDoc(collection(db, "pedidos_plantas"), fullPayload);
      setFormSuccess(true);
    } catch (err: any) {
      console.error("Erro ao enviar mensagem:", err);
      try {
        handleFirestoreError(err, OperationType.CREATE, "pedidos_plantas");
      } catch (wrapped) {}
    } finally {
      setIsSendingMsg(false);
    }
  };

  const handleRequestOfficialBlueprint = () => {
    const activeName = clientName || "Cliente Netek";
    
    const roomsListString = rooms.map(r => 
      `• ${r.name}: ${r.width.toFixed(1)}m x ${r.length.toFixed(1)}m = ${(r.width * r.length).toFixed(1)}m²`
    ).join("\n");
    
    const message = `*SOLICITAÇÃO DE PLANTA OFICIAL (CAD/DWG) - NETEK SERVICES* 📐\n\n` +
      `Olá Diretor Jonson JB! Estive a simular os compartimentos da minha obra no portal Netek Services e gostaria de encomendar o projeto técnico oficial detalhado.\n\n` +
      `*DADOS DA CONSTRUÇÃO:* \n` +
      `- *Cliente:* ${activeName}\n` +
      `- *Modelo Pretendido:* ${houseType}\n` +
      `- *Dimensões do Terreno:* ${terrainDimensions} m\n` +
      `- *Número de Pisos:* ${floors} piso(s)\n` +
      `- *Espessura das Paredes:* ${materialType === "bloco_15" ? "Bloco de 15cm" : "Bloco de 20cm"}\n` +
      `- *Área Coberta Total Estimada:* ${calculateTotalArea().toFixed(1)} m²\n\n` +
      `*COMPARTIMENTOS PROGRAMADOS:* \n` +
      `${roomsListString}\n\n` +
      `Gostaria de obter a planta oficial AutoCAD dwg, ficheiros PDF com os cortes das fundações, vãos e fachadas, e agendar uma reunião técnica para discutir os prazos e condições comerciais de contratação.\n\n` +
      `Obrigado! Aguardo retorno.`;
      
    window.open(`https://wa.me/258835109190?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleExportDXF = () => {
    // Clean, scalable Drawing Exchange Format (DXF) generation
    let dxf = "0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1015\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n";

    let offsetX = 0.0;
    rooms.forEach((room) => {
      const w = room.width;
      const l = room.length;
      
      const drawLine = (x1: number, y1: number, x2: number, y2: number, layer: string = "ALVENARIA_NETEK") => {
        return `0\nLINE\n8\n${layer}\n10\n${x1.toFixed(3)}\n20\n${y1.toFixed(3)}\n30\n0.0\n11\n${x2.toFixed(3)}\n21\n${y2.toFixed(3)}\n31\n0.0\n`;
      };

      // Real compartments bounding coordinates
      dxf += drawLine(offsetX, 0, offsetX + w, 0);
      dxf += drawLine(offsetX + w, 0, offsetX + w, l);
      dxf += drawLine(offsetX + w, l, offsetX, l);
      dxf += drawLine(offsetX, l, offsetX, 0);

      // Label at the geometric centroid of each compartment inside the workspace
      const cx = offsetX + (w / 2);
      const cy = l / 2;
      
      dxf += `0\nTEXT\n8\nETIQUETAS\n10\n${cx.toFixed(3)}\n20\n${cy.toFixed(3)}\n30\n0.0\n40\n0.22\n1\n${room.name} (${w.toFixed(1)}x${l.toFixed(1)}m)\n`;
      
      // Create a 2.0 meter visual draft separator between columns
      offsetX += w + 2.0; 
    });

    dxf += "0\nENDSEC\n0\nEOF\n";

    const blob = new Blob([dxf], { type: "application/dxf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    const sanitizedHouseType = houseType.replace(/\s+/g, '_') || "Custom_Model";
    link.download = `NETEK_LAYOUT_${sanitizedHouseType.toUpperCase()}_AUTO_CAD.dxf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const startFromScratch = () => {
    setRooms([]);
    setStep(2);
  };

  const handleNextToDesigner = () => {
    setStep(2);
  };

  const resetForm = () => {
    setStep(1);
    setIsCalculated(false);
    setResults(null);
  };

  const totalBuildArea = calculateTotalArea();
  const estimatedWallLength = calculateLinearWalls();

  // Parsing terrain size for recommendation warnings
  const parseTerrainSquareMeters = () => {
    try {
      const parts = terrainDimensions.toLowerCase().split("x");
      if (parts.length === 2) {
        const w = parseFloat(parts[0]);
        const l = parseFloat(parts[1]);
        if (!isNaN(w) && !isNaN(l)) return w * l;
      }
    } catch (e) {}
    return 360; // default standard 12x30 lote = 360m2
  };
  const terrainArea = parseTerrainSquareMeters();
  const excessiveCoverageWarning = totalBuildArea > (terrainArea * 0.75);

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8" id="engineering-module">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-gray-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="bg-[#ff6600]/15 p-3 rounded-2xl shrink-0">
            <Layout className="h-6 w-6 text-[#ff6600]" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-extrabold text-[#2c3e50] tracking-tight">
              Desenho da Planta & Cálculo de Materiais
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Idealize a sua casa compartimento a compartimento, visualize a planta em tempo real e estime o cimento, blocos e inertes necessários
            </p>
          </div>
        </div>

        {/* Interactive Steps Labels */}
        <div className="flex items-center gap-2 bg-[#2c3e50]/5 p-1 rounded-xl self-start md:self-auto" id="step-breadcrumb">
          <button
            onClick={() => setStep(1)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              step === 1 ? "bg-[#2c3e50] text-white" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            1. Setup Terreno
          </button>
          <span className="text-gray-300 text-xs">/</span>
          <button
            onClick={() => setStep(2)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              step === 2 ? "bg-[#2c3e50] text-white" : "text-gray-500 hover:text-gray-800"
            }`}
            disabled={rooms.length === 0 && step === 1}
          >
            2. Desenhar Planta
          </button>
          <span className="text-gray-300 text-xs">/</span>
          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
              step === 3 ? "bg-[#ff6600] text-white" : "text-gray-400"
            }`}
          >
            3. Estimativas
          </span>
        </div>
      </div>

      {/* Dynamic progress loader gauge bar */}
      <div className="mb-6 bg-gray-200/60 h-2 rounded-full overflow-hidden" id="loader-gauge">
        <div
          className="bg-[#ff6600] h-full transition-all duration-500 ease-out"
          style={{ width: `${step === 1 ? 33 : step === 2 ? 66 : 100}%` }}
        ></div>
      </div>

      {/* STEP 1: INITIAL DISPOSITION SETUP & MOZAMBIQUE TEMPLATE SELECTION */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
          id="setup-tab-pane"
        >
          <div className="bg-blue-50/70 p-4 border border-blue-100 rounded-2xl flex gap-3 text-sm text-[#2c3e50]" id="setup-welcome">
            <Info className="h-5 w-5 text-indigo-700 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <p className="font-bold text-[#2c3e50]">Bem vindo ao Módulo de Engenharia e Arquitetura Avançada!</p>
              <p className="text-xs text-gray-600 mt-1">
                Introduza as especificações físicas do terreno para garantirmos a conformidade legal do DUAT sobre os limites de recuos sanitários e taxa de implantação em Moçambique. De seguida, escolha um modelo de tipologia ou crie a sua planta do zero.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5" id="terrain-settings-block">
            {/* Terrain Dimensions */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">
                Dimensões do Terreno (Lote)
              </label>
              <div className="relative">
                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={terrainDimensions}
                  onChange={(e) => setTerrainDimensions(e.target.value)}
                  placeholder="Ex: 12x30 ou 15x30 (metros)"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#ff6600] focus:ring-1 focus:ring-[#ff6600] text-sm text-gray-800 font-mono"
                  required
                />
              </div>
              <p className="text-[10px] text-gray-400 font-mono">Total calculado: {terrainArea}m² de área loteada.</p>
            </div>

            {/* Select Floors */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">
                Nº de Pisos Planeados
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFloors(num)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      floors === num
                        ? "bg-[#2c3e50] border-[#2c3e50] text-white shadow-sm"
                        : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {num === 1 ? "Térreo" : num === 2 ? "1º Andar" : "2º Andar"}
                  </button>
                ))}
              </div>
            </div>

            {/* Select Wall Block Thickness */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">
                Material das Paredes
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMaterialType("bloco_15")}
                  className={`py-2 px-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer leading-tight text-center ${
                    materialType === "bloco_15"
                      ? "bg-orange-50 border-[#ff6600] text-[#ff6600]"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Bloco de 15 cm
                  <span className="block text-[8px] font-normal text-gray-400 mt-0.5">Económico / Poupa cimento</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMaterialType("bloco_20")}
                  className={`py-2 px-1 text-[11px] font-bold rounded-xl border transition-all cursor-pointer leading-tight text-center ${
                    materialType === "bloco_20"
                      ? "bg-orange-50 border-[#ff6600] text-[#ff6600]"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Bloco de 20 cm
                  <span className="block text-[8px] font-normal text-gray-400 mt-0.5">Forte / Isolador térmico</span>
                </button>
              </div>
            </div>

            {/* Contact Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase text-gray-500 tracking-wider">
                Contacto de E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder={auth.currentUser?.email || "seuemail@gmail.com"}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-[#ff6600] outline-none text-xs text-gray-800"
                />
              </div>
            </div>
          </div>

          {/* Preset templates selector in nice grid format */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#2c3e50] uppercase tracking-wider flex items-center gap-1.5 pt-2">
              <Sparkles className="h-4 w-4 text-[#ff6600]" /> Selecione um Modelo de Partida (Comum no Mercado)
            </h3>
            <p className="text-xs text-gray-500">
              Não quer desenhar a planta manualmente? Escolha uma das tipologias padrão moçambicanas para pré-carregar os compartimentos exatos sugeridos por arquitetos locais:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 animate-fade-in" id="template-options">
              {/* Preset Tipo 1 */}
              <button
                type="button"
                onClick={() => applyPresetTemplate("Tipo 1")}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  houseType === "Tipo 1"
                    ? "border-[#ff6600] bg-orange-50/30 ring-1 ring-[#ff6600]"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#2c3e50]">Tipo 1 (Compacta)</span>
                    {houseType === "Tipo 1" && <Check className="h-4 w-4 text-[#ff6600]" />}
                  </div>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    Excelente para moradias unifamiliares compactas ou anexos modernos.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-bold text-[#ff6600] font-mono">
                  4 Compartimentos • ~32 m²
                </div>
              </button>

              {/* Preset Tipo 2 */}
              <button
                type="button"
                onClick={() => applyPresetTemplate("Tipo 2")}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  houseType === "Tipo 2"
                    ? "border-[#ff6600] bg-orange-50/30 ring-1 ring-[#ff6600]"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#2c3e50]">Tipo 2 (Padrão Familiar)</span>
                    {houseType === "Tipo 2" && <Check className="h-4 w-4 text-[#ff6600]" />}
                  </div>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    O modelo de plano mais consumido e valorizado em Moçambique.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-bold text-[#ff6600] font-mono">
                  6 Compartimentos • ~55 m²
                </div>
              </button>

              {/* Preset Tipo 3 */}
              <button
                type="button"
                onClick={() => applyPresetTemplate("Tipo 3")}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  houseType === "Tipo 3"
                    ? "border-[#ff6600] bg-orange-50/30 ring-1 ring-[#ff6600]"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#2c3e50]">Tipo 3 (Espaçosa)</span>
                    {houseType === "Tipo 3" && <Check className="h-4 w-4 text-[#ff6600]" />}
                  </div>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    Layout de luxo para terrenos maiores. Integra suite privada e varandas generosas.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-bold text-[#ff6600] font-mono">
                  8 Compartimentos • ~96 m²
                </div>
              </button>

              {/* Preset Tipo 4 */}
              <button
                type="button"
                onClick={() => applyPresetTemplate("Tipo 4")}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  houseType === "Tipo 4"
                    ? "border-[#ff6600] bg-orange-50/30 ring-1 ring-[#ff6600]"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs"
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-[#2c3e50]">Tipo 4 (Mansão/Duplex)</span>
                    {houseType === "Tipo 4" && <Check className="h-4 w-4 text-[#ff6600]" />}
                  </div>
                  <p className="text-[11px] text-gray-400 leading-normal">
                    Moradia de alto padrão com garagem fechada integrada e múltiplas suites generosas.
                  </p>
                </div>
                <div className="mt-3 text-[10px] font-bold text-[#ff6600] font-mono">
                  10 Compartimentos • ~165 m²
                </div>
              </button>
            </div>
          </div>

          {/* CTA Next steps zone */}
          <div className="pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-xs font-bold text-[#2c3e50] uppercase tracking-wider">Total Carregado para Edição Visual:</p>
              <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                {rooms.length} Compartimentos • Área Coberta Estimada: {totalBuildArea} m²
              </p>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={startFromScratch}
                className="flex-1 sm:flex-none py-2.5 px-4 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 text-center transition-all cursor-pointer"
              >
                Criar Planta do Zero 🛠️
              </button>

              <button
                type="button"
                onClick={handleNextToDesigner}
                className="flex-1 sm:flex-none py-2.5 px-6 bg-[#2c3e50] hover:bg-[#1a252f] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                Avançar para Desenho de Planta <ChevronRight className="h-4 w-4 text-[#ff6600]" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 2: INCREDIBLE VISUAL FLOOR PLAN GENERATOR & GRAPH Blueprint EDITOR */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
          id="visualizer-pane"
        >
          {/* Informational Guidance bar */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50/55 p-4 border border-blue-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[#2c3e50]">
            <div className="flex gap-2 text-xs">
              <Info className="h-5 w-5 text-[#2c3e50] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Modo de Modelação Ativa de Planta</p>
                <p className="text-gray-500 mt-0.5">
                  Adicione e configure o comprimento (c) e largura (l) de cada quarto. O sistema calcula a área e as paredes automaticamente para dar a estimativa final.
                </p>
              </div>
            </div>

            {/* Quick stats indicators */}
            <div className="flex gap-3 text-right bg-white px-3.5 py-1.5 rounded-xl border border-blue-100/50 block tracking-wide">
              <div className="text-center sm:text-left pr-3 border-r border-gray-100">
                <span className="text-[9px] text-gray-400 uppercase font-bold block">Área Útil</span>
                <span className="text-sm font-extrabold text-[#2c3e50]">
                  {totalBuildArea} m²
                </span>
              </div>
              <div className="text-center sm:text-left">
                <span className="text-[9px] text-gray-400 uppercase font-bold block">Paredes Totais</span>
                <span className="text-sm font-extrabold text-[#2c3e50]">
                  {estimatedWallLength} m de extensão
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Control Column - Add Compartments */}
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-gray-100 space-y-4 shadow-sm" id="tool-bar-selector">
              <h4 className="font-bold text-xs uppercase text-gray-400 tracking-wider flex items-center gap-1">
                <Settings className="h-3.5 w-3.5" /> Adicionar Novos Compartimentos
              </h4>
              
              <div className="grid grid-cols-2 gap-2" id="building-blocks-pool">
                <button
                  type="button"
                  onClick={() => appendRoom("bedroom")}
                  className="p-2 bg-sky-50 hover:bg-sky-100/70 text-sky-800 rounded-xl text-xs font-bold border border-sky-100 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <span className="text-base">🛏️</span>
                  <span>Quarto Standard</span>
                </button>
                <button
                  type="button"
                  onClick={() => appendRoom("suite")}
                  className="p-2 bg-indigo-50 hover:bg-indigo-100/70 text-indigo-800 rounded-xl text-xs font-bold border border-indigo-100 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <span className="text-base">💎</span>
                  <span>Suite com W.C.</span>
                </button>
                <button
                  type="button"
                  onClick={() => appendRoom("living")}
                  className="p-2 bg-emerald-50 hover:bg-emerald-100/70 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-100 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <span className="text-base">🛋️</span>
                  <span>Sala Comum</span>
                </button>
                <button
                  type="button"
                  onClick={() => appendRoom("kitchen")}
                  className="p-2 bg-amber-50 hover:bg-amber-100/70 text-amber-800 rounded-xl text-xs font-bold border border-amber-100 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <span className="text-base">🍳</span>
                  <span>Cozinha / Copa</span>
                </button>
                <button
                  type="button"
                  onClick={() => appendRoom("bathroom")}
                  className="p-2 bg-rose-50 hover:bg-rose-100/70 text-rose-800 rounded-xl text-xs font-bold border border-rose-100 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <span className="text-base">🚽</span>
                  <span>Casinha de Banho</span>
                </button>
                <button
                  type="button"
                  onClick={() => appendRoom("porch")}
                  className="p-2 bg-teal-50 hover:bg-teal-100/70 text-teal-800 rounded-xl text-xs font-bold border border-teal-100 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <span className="text-base">🌅</span>
                  <span>Varanda / Hall</span>
                </button>
                <button
                  type="button"
                  onClick={() => appendRoom("garage")}
                  className="p-2 bg-slate-50 hover:bg-slate-100/70 text-slate-800 rounded-xl text-xs font-bold border border-slate-100 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <span className="text-base">🚗</span>
                  <span>Garagem</span>
                </button>
                <button
                  type="button"
                  onClick={() => appendRoom("pantry")}
                  className="p-2 bg-purple-50 hover:bg-purple-100/70 text-purple-800 rounded-xl text-xs font-bold border border-purple-100 transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-1.5"
                >
                  <span className="text-base">📦</span>
                  <span>Dispensa</span>
                </button>
              </div>

              {/* Warnings and alerts based on construction coverage */}
              {excessiveCoverageWarning && (
                <div className="bg-red-50 border border-red-100 p-3 rounded-2xl text-red-800 text-[11px] leading-relaxed space-y-1 animate-pulse">
                  <p className="font-bold flex items-center gap-1">⚠️ Elevada Ocupação de Solo!</p>
                  <p className="opacity-90">
                    A área total projetada para a casa térrea ({totalBuildArea} m²) ultrapassa 75% da área total disponível no seu lote de {terrainDimensions}m ({terrainArea}m²). Recomendamos ponderar uma moradia duplex (2 Pisos) ou diminuir os limites dos compartimentos para salvaguardar quintal e jardins.
                  </p>
                </div>
              )}

              {rooms.length === 0 && (
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl text-[11px] text-gray-700 leading-normal">
                  <p className="font-bold text-[#ff6600]">Nenhum quarto desenhado!</p>
                  <p className="mt-0.5">Selecione e adicione blocos de compartimento com a matriz acima para começarmos a delinear as paredes no blueprint arquiteto.</p>
                </div>
              )}

              <div className="border-t border-gray-100 pt-3">
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Pre-requisitos Municipais</span>
                <p className="text-[10px] text-gray-500 leading-relaxed mt-1">
                  Para cumprir os regulamentos do Conselho Municipal, garanta recuos mínimos de 2 metros nas traseiras e 1.5 metros nas laterais.
                </p>
              </div>
            </div>

            {/* Right Column - Visual Live Floor Plan Blueprint Graph Map & Rooms List */}
            <div className="lg:col-span-8 space-y-4 flex flex-col h-full" id="blueprint-canvas-column">
              {/* Graphic Blueprint Screen */}
              <div
                className="bg-[#101726]/95 border-2 border-[#1e293b] rounded-3xl p-6 relative overflow-hidden shadow-inner h-[280px] flex flex-col justify-between"
                style={{
                  backgroundImage: "radial-gradient(ellipse at center, #1e293b 0.5px, transparent 1px)",
                  backgroundSize: "18px 18px",
                }}
                id="interactive-blueprint-canvas"
              >
                {/* Visual Title Header */}
                <div className="flex justify-between items-center z-10 shrink-0">
                  <div className="flex items-center gap-2">
                    <Grid className="h-4 w-4 text-[#ff6600] animate-spin" />
                    <span className="text-white/60 font-mono text-[10px] uppercase tracking-wider">
                      Esquematizador de Planta de Casa NK (Moçambique)
                    </span>
                  </div>
                  <div className="bg-white/10 px-2.5 py-0.5 rounded-md border border-white/15">
                    <span className="text-emerald-400 font-mono text-[10px] font-extrabold uppercase">
                      Lote: {terrainDimensions}m
                    </span>
                  </div>
                </div>

                {/* Simulated blueprint box list representation */}
                <div className="flex-grow flex items-center justify-center p-2 z-10 overflow-x-auto min-h-[160px]">
                  {rooms.length === 0 ? (
                    <div className="text-center space-y-1.5 text-white/30">
                      <Ruler className="h-8 w-8 mx-auto stroke-[1.5]" />
                      <p className="text-xs font-mono">Lote de Construção Limpo</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center justify-center gap-3 max-w-full overflow-y-auto max-h-[160px]">
                      {rooms.map((room) => {
                        const area = (room.width * room.length).toFixed(1);
                        return (
                          <div
                            key={room.id}
                            className={`p-2 rounded-xl border flex flex-col justify-between min-w-[110px] min-h-[70px] uppercase font-mono shadow-md ${getRoomTypeColor(
                              room.type
                            )}`}
                          >
                            <span className="text-[9px] font-bold tracking-tight truncate max-w-[100px] text-white">
                              {room.name}
                            </span>
                            <div className="flex items-end justify-between mt-2">
                              <span className="text-[10px] font-bold text-white font-sans">
                                {room.width}x{room.length}m
                              </span>
                              <span className="text-[8px] bg-white/10 px-1 py-0.5 rounded text-white/80">
                                {area}m²
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer Blueprint info bar */}
                <div className="flex justify-between items-center z-10 text-[10px] text-white/50 shrink-0 border-t border-white/5 pt-2">
                  <span>Modo: Interativo de Compartimentos</span>
                  <span className="font-mono text-emerald-400">
                    Área Total Coberta: <strong className="text-white">{totalBuildArea} m²</strong>
                  </span>
                </div>
              </div>

              {/* Rooms List with size increments editable */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 max-h-[300px] overflow-y-auto flex-grow" id="custom-rooms-dimensions-list">
                <span className="text-xs font-bold text-[#2c3e50] uppercase tracking-wide block">
                  Ajustar Limites dos Compartimentos ({rooms.length})
                </span>

                <div className="space-y-2">
                  {rooms.map((room) => (
                    <div
                      key={room.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors gap-3"
                    >
                      <div className="min-w-[124px] max-w-[160px] truncate">
                        <span className="text-xs font-bold text-[#2c3e50] block truncate">
                          {room.name}
                        </span>
                        <span className="text-[10px] text-gray-400 uppercase font-mono block mt-0.5">
                          {room.type} • {(room.width * room.length).toFixed(1)} m²
                        </span>
                      </div>

                      {/* Controller for WIDTH */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Largura:</span>
                        <button
                          type="button"
                          onClick={() => updateRoomDimension(room.id, "width", false)}
                          className="w-7 h-7 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-9 text-center font-mono text-xs font-bold text-gray-800">
                          {room.width.toFixed(1)}m
                        </span>
                        <button
                          type="button"
                          onClick={() => updateRoomDimension(room.id, "width", true)}
                          className="w-7 h-7 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Controller for LENGTH */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-gray-400 uppercase">Compr.:</span>
                        <button
                          type="button"
                          onClick={() => updateRoomDimension(room.id, "length", false)}
                          className="w-7 h-7 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-9 text-center font-mono text-xs font-bold text-gray-800">
                          {room.length.toFixed(1)}m
                        </span>
                        <button
                          type="button"
                          onClick={() => updateRoomDimension(room.id, "length", true)}
                          className="w-7 h-7 bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center justify-center font-bold text-xs cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => removeRoom(room.id)}
                        className="text-gray-300 hover:text-red-500 p-1.5 rounded-lg transition-colors cursor-pointer self-end sm:self-auto"
                        title="Eliminar Compartimento"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Nav system step 2 to calculations */}
          <div className="pt-5 border-t border-gray-100 flex justify-between items-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" /> Configurar Lote / Modelo
            </button>

            <button
              type="button"
              onClick={handleCalculateAndSubmit}
              disabled={isLoading || rooms.length === 0}
              className="px-8 py-3 bg-[#ff6600] text-white hover:bg-orange-600 rounded-xl font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md hover:shadow-orange-200 cursor-pointer"
              id="calc-materials-action-btn"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Calculator className="h-4 w-4 animate-bounce" /> Calcular Material de Construção ⚙️
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: CONCRETE DETAILED BUILDING ESTIMATION RESULTS VIEW */}
      {step === 3 && results && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
          id="calculation-results-board"
        >
          {/* Header Banner */}
          <div className="bg-[#2c3e50] text-white p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md relative overflow-hidden border border-gray-150/10">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#ff6600]/15 rounded-full blur-2xl -mr-8 -mt-8 animate-pulse"></div>
            
            <div className="space-y-1.5 z-10">
              <span className="text-orange-400 font-bold uppercase tracking-widest text-[10px] flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Relatório Técnico Gerado com Sucesso!
              </span>
              <h3 className="text-xl md:text-2xl font-extrabold pb-0.5">
                Estimativa de Infraestrutura • {houseType}
              </h3>
              <p className="text-xs text-gray-300">
                Terreno loteado em {terrainDimensions}m | {floors === 1 ? "Vivenda Térrea" : `${floors} Pisos / Sobrado`} | Tipo de parede {materialType === "bloco_15" ? "15cm" : "20cm"}
              </p>
            </div>

            <div className="flex items-center gap-3.5 flex-wrap z-10">
              <button
                type="button"
                onClick={handleDownloadEngineeringPDF}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-3 rounded-2xl flex items-center gap-2 cursor-pointer transition-all shadow-sm"
                title="Baixar PDF estruturado do cálculo de materiais"
              >
                <FileDown className="h-5 w-5" /> Exportar Relatório PDF 📥
              </button>
              <div className="bg-[#ff6600] text-white px-5 py-3 rounded-2xl shrink-0 text-center self-start md:self-auto shadow-sm">
                <span className="text-[10px] text-white/80 uppercase font-bold block">Área Coberta Útil</span>
                <span className="text-lg font-extrabold text-white font-mono mt-0.5 block">{results.totalArea} m²</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4" id="materials-results-grid">
            
            {/* Cement */}
            <div className="p-5 bg-white border border-gray-150 rounded-2xl text-center flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide block">Sacos de Cimento</span>
                <span className="text-2xl font-black text-[#2c3e50] mt-1 block">{results.cementBags}</span>
              </div>
              <span className="text-[9px] text-gray-500 font-mono block mt-2 pt-2 border-t border-gray-100 leading-normal">
                Sacos standard de 50kg (Classe 32.5/42.5N)
              </span>
            </div>

            {/* Bricks/Blocks */}
            <div className="p-5 bg-white border border-gray-150 rounded-2xl text-center flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide block">Blocos de Cimento</span>
                <span className="text-2xl font-black text-[#2c3e50] mt-1 block">{results.blocksCount}</span>
              </div>
              <span className="text-[9px] text-gray-500 font-mono block mt-2 pt-2 border-t border-gray-100 leading-normal">
                Para alvenaria de {materialType === "bloco_15" ? "15cm" : "20cm"} (+12% quebra)
              </span>
            </div>

            {/* Sand */}
            <div className="p-5 bg-white border border-gray-150 rounded-2xl text-center flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide block">Areia Fina / Grossa</span>
                <span className="text-2xl font-black text-[#2c3e50] mt-1 block">{results.sandVolume} m³</span>
              </div>
              <span className="text-[9px] text-gray-500 font-mono block mt-2 pt-2 border-t border-gray-100 leading-normal">
                Para misturas de argamassas e rebocos exteriores
              </span>
            </div>

            {/* Stone/Gravel */}
            <div className="p-5 bg-white border border-gray-150 rounded-2xl text-center flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide block">Pedra Britada</span>
                <span className="text-2xl font-black text-[#2c3e50] mt-1 block">{results.stoneVolume} m³</span>
              </div>
              <span className="text-[9px] text-gray-500 font-mono block mt-2 pt-2 border-t border-gray-100 leading-normal">
                Recomendada brita 1 e 2 para vigas de fundação
              </span>
            </div>

            {/* Concrete */}
            <div className="p-5 bg-white border border-gray-150 rounded-2xl text-center flex flex-col justify-between shadow-xs col-span-2 md:col-span-1">
              <div>
                <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wide block">Total Betão Armado</span>
                <span className="text-2xl font-black text-[#2c3e50] mt-1 block">{results.concreteVolume} m³</span>
              </div>
              <span className="text-[9px] text-gray-500 font-mono block mt-2 pt-2 border-t border-gray-100 leading-normal">
                Massa volumétrica estimada líquida de pilares/placas
              </span>
            </div>
          </div>

          {/* CALCULATE DOORS AND WINDOWS (Cálculo de Portas e Janelas) */}
          <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-xs space-y-4" id="doors-windows-stats">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <h4 className="font-extrabold text-[#2c3e50] text-sm uppercase tracking-wider flex items-center gap-1.5">
                  🚪 Dimensionamento de Vãos: Portas &amp; Janelas da Casa
                </h4>
                <p className="text-[11px] text-gray-400">
                  Cálculo automático de esquadrias e portais recomendado por arquitetos da Netek Services
                </p>
              </div>
              <div className="flex gap-2">
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full font-mono">
                  {results.doorsCount} Portas Necessárias
                </span>
                <span className="bg-[#ff6600]/10 text-[#ff6600] text-[10px] font-bold px-3 py-1 rounded-full font-mono">
                  {results.windowsCount} Janelas Necessárias
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Doors List */}
              <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 space-y-3">
                <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wide flex items-center gap-1">
                  🚪 Portas de Madeira &amp; Alumínio ({results.doorsCount} no total)
                </h5>
                <div className="space-y-2">
                  {results.doorsList.map((door, index) => (
                    <div key={index} className="flex justify-between items-center text-xs bg-white p-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-800">{door.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Dimensão: {door.size}</p>
                      </div>
                      <span className="bg-[#2c3e50] text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg">
                        {door.qty} {door.qty === 1 ? "vão" : "vãos"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Windows List */}
              <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 space-y-3">
                <h5 className="font-bold text-xs text-slate-800 uppercase tracking-wide flex items-center gap-1">
                  🪟 Janelas de Alumínio &amp; Basculantes ({results.windowsCount} no total)
                </h5>
                <div className="space-y-2">
                  {results.windowsList.map((win, index) => (
                    <div key={index} className="flex justify-between items-center text-xs bg-white p-3 rounded-xl border border-gray-100">
                      <div>
                        <p className="font-bold text-gray-800">{win.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">Dimensão: {win.size}</p>
                      </div>
                      <span className="bg-[#ff6600] text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg">
                        {win.qty} {win.qty === 1 ? "vão" : "vãos"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* BLUEPRINT PREVIEW WITH MEASUREMENTS (Planta já com medidas pra prévia) */}
          <div className="bg-[#090e18] border-2 border-[#1e293b] rounded-3xl p-6 relative overflow-hidden shadow-lg" id="calculated-prev-blueprint">
            <div className="absolute top-0 right-0 w-44 h-44 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/5 pb-4 mb-4 gap-4">
              <div>
                <span className="bg-blue-500/15 text-blue-400 text-[9px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider font-mono border border-blue-500/10">
                  ESBOÇO TÉCNICO INTERACTIVO (PRÉVIA DIGITAL)
                </span>
                <h4 className="font-bold text-base text-white mt-1">
                  Planta Arquitetónica com Medidas de Alvenaria e Vãos
                </h4>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportDXF}
                  className="bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/35 text-blue-300 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-1.5 active:scale-95 text-center shadow-lg"
                  title="Exportar esboço 2D completo em formato de ficheiro vetorial DXF para AutoCAD"
                >
                  <FileDown className="h-3.5 w-3.5 text-[#ff6600]" />
                  <span>Exportar DXF/CAD</span>
                </button>
                <div className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-mono text-gray-400">
                  Pisos: {floors} Piso(s) • Lote Estático
                </div>
              </div>
            </div>

            {/* Engineering Blueprint Viewport */}
            {(() => {
              // Layout calculation for rooms in SVG
              const svgOffsetScale = 42; // Pixels per meter
              const wallThickness = 0.15 * svgOffsetScale; // 15cm wall thickness in pixels
              const SpacingMeters = 0.8; // gap between compartments for layout separation
              
              let currentX = 0.8; // initial outer margin left in meters
              let currentY = 0.8; // initial outer margin top in meters
              let maxRowHeight = 0;
              const maxRowWidth = 11.5; // max width in meters per block row before wrap

              const arrangedRooms = rooms.map((room) => {
                if (currentX + room.width > maxRowWidth && currentX > 0.8) {
                  currentX = 0.8;
                  currentY += maxRowHeight + SpacingMeters + 0.6; // row spacing
                  maxRowHeight = 0;
                }

                const assignedX = currentX;
                const assignedY = currentY;

                currentX += room.width + SpacingMeters;
                if (room.length > maxRowHeight) {
                  maxRowHeight = room.length;
                }

                return {
                  ...room,
                  x: assignedX,
                  y: assignedY,
                  pX: assignedX * svgOffsetScale,
                  pY: assignedY * svgOffsetScale,
                  pW: room.width * svgOffsetScale,
                  pH: room.length * svgOffsetScale,
                };
              });

              const totalWidthMeters = Math.max(12.0, currentX > 0.8 ? maxRowWidth : 0) + 1.2;
              const totalHeightMeters = currentY + maxRowHeight + 1.2;

              const svgWidth = totalWidthMeters * svgOffsetScale;
              const svgHeight = totalHeightMeters * svgOffsetScale;

              return (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#0c1424]/90 p-5 rounded-3xl border border-blue-900/35 shadow-inner">
                  {/* Left Column: Proportional CAD Interactive Grid Map */}
                  <div className="lg:col-span-8 flex flex-col justify-between space-y-4">
                    <div className="text-left flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#ff6600] font-black tracking-widest bg-[#ff6600]/10 px-2.5 py-1 rounded">
                          ESBOÇO DIGITAL PLANTA SVG 2D INTERATIVO
                        </span>
                        <p className="text-gray-300 text-xs font-semibold mt-2">
                          Esboço proporcional real calibrado em metros. Clique nos compartimentos para redimensionar:
                        </p>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-[#ff6600] bg-[#ff6600]/10 px-2.5 py-1 rounded">
                        Área de Implantação: {calculateTotalArea().toFixed(1)} m²
                      </span>
                    </div>

                    {/* Blueprint SVG Canvas Box */}
                    <div className="relative w-full bg-[#070b13] border border-blue-950 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center p-4 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
                      {/* Compass / Grid background decorators */}
                      <div className="absolute top-2.5 left-2.5 text-[9px] font-mono text-gray-500 flex items-center gap-1.5 opacity-75 z-10">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                        <span>SALA TÉCNICA NETEK: DETALHAMENTO DE ALVENARIAS</span>
                      </div>
                      <div className="absolute bottom-2.5 right-2.5 text-[8.5px] font-mono text-gray-500 opacity-60 z-10">
                        ESCALA VIRTUAL METRO-PIXEL • LOTE ESTÁTICO
                      </div>

                      {rooms.length === 0 ? (
                        <div className="py-12 text-center text-gray-500 text-xs font-mono">
                          Nenhum compartimento inserido. Adicione compartimentos para desenhar a planta!
                        </div>
                      ) : (
                        <div className="w-full overflow-auto flex justify-center py-4">
                          <svg
                            width={svgWidth}
                            height={svgHeight}
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            className="bg-[#050911] border border-blue-950 rounded-2xl shadow-2xl shrink-0"
                          >
                            <defs>
                              <marker id="cad-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#ff6600" />
                              </marker>
                              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#101b30" strokeWidth="0.5" />
                              </pattern>
                            </defs>
                            
                            {/* Grid paper lines */}
                            <rect width="100%" height="100%" fill="url(#grid)" />

                            {/* Rooms drafting layer */}
                            {arrangedRooms.map((room) => {
                              const isActive = room.id === currentActiveRoomId;

                              // Swing doors logic & Window layers layout
                              const mainDoorOpeningY = room.pY + room.pH - wallThickness;
                              const windowPaneX = room.pX + room.pW - wallThickness - 2;
                              const windowPaneY = room.pY + (room.pH / 2) - 12;

                              return (
                                <g key={room.id} className="group cursor-pointer">
                                  {/* Compartment Outer Solid Foundation Wall */}
                                  <rect
                                    x={room.pX}
                                    y={room.pY}
                                    width={room.pW}
                                    height={room.pH}
                                    rx={6}
                                    fill={isActive ? "#112340" : "#0d1424"}
                                    stroke={isActive ? "#ff6600" : "#22324f"}
                                    strokeWidth={isActive ? 3 : 1.8}
                                    onClick={() => setSelectedBlueprintRoomId(room.id)}
                                    className="transition-all duration-300 hover:fill-[#1e2d4a]/80"
                                  />

                                  {/* Double masonry brick contour pattern */}
                                  <rect
                                    x={room.pX + wallThickness}
                                    y={room.pY + wallThickness}
                                    width={room.pW - (2 * wallThickness)}
                                    height={room.pH - (2 * wallThickness)}
                                    rx={4}
                                    fill="none"
                                    stroke={isActive ? "#ff6600" : "#475569"}
                                    strokeWidth={1}
                                    strokeDasharray="2,2"
                                    className="opacity-80"
                                  />

                                  {/* Dynamic CAD-Style Dimension Extension Lines (Horizontal Line) */}
                                  <line
                                    x1={room.pX}
                                    y1={room.pY - 10}
                                    x2={room.pX + room.pW}
                                    y2={room.pY - 10}
                                    stroke={isActive ? "#ff6600" : "#475569"}
                                    strokeWidth={1}
                                    markerStart="url(#cad-arrow)"
                                    markerEnd="url(#cad-arrow)"
                                  />
                                  <line x1={room.pX} y1={room.pY - 15} x2={room.pX} y2={room.pY - 5} stroke={isActive ? "#ff6600" : "#475569"} strokeWidth={1} />
                                  <line x1={room.pX + room.pW} y1={room.pY - 15} x2={room.pX + room.pW} y2={room.pY - 5} stroke={isActive ? "#ff6600" : "#475569"} strokeWidth={1} />

                                  {/* Horizontal Dimension text label */}
                                  <rect
                                    x={room.pX + (room.pW / 2) - 18}
                                    y={room.pY - 16}
                                    width={36}
                                    height={11}
                                    fill="#050911"
                                    rx={2}
                                  />
                                  <text
                                    x={room.pX + (room.pW / 2)}
                                    y={room.pY - 8}
                                    textAnchor="middle"
                                    fill={isActive ? "#ff6600" : "#94a3b8"}
                                    className="text-[8px] font-mono font-bold select-none pointer-events-none"
                                  >
                                    {room.width.toFixed(1)}m
                                  </text>

                                  {/* Dynamic CAD-Style Dimension Extension Lines (Vertical Line) */}
                                  <line
                                    x1={room.pX - 10}
                                    y1={room.pY}
                                    x2={room.pX - 10}
                                    y2={room.pY + room.pH}
                                    stroke={isActive ? "#ff6600" : "#475569"}
                                    strokeWidth={1}
                                    markerStart="url(#cad-arrow)"
                                    markerEnd="url(#cad-arrow)"
                                  />
                                  <line x1={room.pX - 15} y1={room.pY} x2={room.pX - 5} y2={room.pY} stroke={isActive ? "#ff6600" : "#475569"} strokeWidth={1} />
                                  <line x1={room.pX - 15} y1={room.pY + room.pH} x2={room.pX - 5} y2={room.pY + room.pH} stroke={isActive ? "#ff6600" : "#475569"} strokeWidth={1} />

                                  {/* Vertical Dimension text label */}
                                  <rect
                                    x={room.pX - 34}
                                    y={room.pY + (room.pH / 2) - 6}
                                    width={22}
                                    height={11}
                                    fill="#050911"
                                    rx={2}
                                  />
                                  <text
                                    x={room.pX - 23}
                                    y={room.pY + (room.pH / 2) + 2}
                                    textAnchor="middle"
                                    fill={isActive ? "#ff6600" : "#94a3b8"}
                                    className="text-[8px] font-mono font-bold select-none pointer-events-none"
                                  >
                                    {room.length.toFixed(1)}m
                                  </text>

                                  {/* Core Room Label & Area */}
                                  <text
                                    x={room.pX + (room.pW / 2)}
                                    y={room.pY + (room.pH / 2) - 4}
                                    textAnchor="middle"
                                    fill={isActive ? "#ffffff" : "#cbd5e1"}
                                    className="text-[9.5px] font-black uppercase tracking-wider select-none pointer-events-none font-sans"
                                  >
                                    {room.name}
                                  </text>
                                  <text
                                    x={room.pX + (room.pW / 2)}
                                    y={room.pY + (room.pH / 2) + 10}
                                    textAnchor="middle"
                                    fill={isActive ? "#ffa500" : "#a0aec0"}
                                    className="text-[8.5px] font-mono select-none pointer-events-none"
                                  >
                                    {(room.width * room.length).toFixed(1)} m²
                                  </text>

                                  {/* --- CIVIL ENGINEERING DRAWING COMPASS: Doors Representation --- */}
                                  {/* Door hinge line at bottom-left corner */}
                                  <line
                                    x1={room.pX + wallThickness + 2}
                                    y1={mainDoorOpeningY - 14}
                                    x2={room.pX + wallThickness + 2}
                                    y2={mainDoorOpeningY - 2}
                                    stroke="#ffa500"
                                    strokeWidth={1.5}
                                  />
                                  {/* Door swing circular path arc (indicated 1/4 arc opening) */}
                                  <path
                                    d={`M ${room.pX + wallThickness + 2} ${mainDoorOpeningY - 14} A 12 12 0 0 1 ${room.pX + wallThickness + 14} ${mainDoorOpeningY - 2}`}
                                    fill="none"
                                    stroke="#ffa500"
                                    strokeWidth={1}
                                    strokeDasharray="2,2"
                                    className="opacity-90"
                                  />

                                  {/* wc specific second door for suites */}
                                  {room.type === "suite" && (
                                    <>
                                      <line
                                        x1={room.pX + room.pW - wallThickness - 14}
                                        y1={room.pY + wallThickness + 2}
                                        x2={room.pX + room.pW - wallThickness - 2}
                                        y2={room.pY + wallThickness + 2}
                                        stroke="#ff6600"
                                        strokeWidth={1.5}
                                      />
                                      <path
                                        d={`M ${room.pX + room.pW - wallThickness - 14} ${room.pY + wallThickness + 2} A 12 12 0 0 0 ${room.pX + room.pW - wallThickness - 2} ${room.pY + wallThickness + 14}`}
                                        fill="none"
                                        stroke="#ff6600"
                                        strokeWidth={1}
                                        strokeDasharray="2,2"
                                      />
                                    </>
                                  )}

                                  {/* --- Window Frames Representation (Parallel outer line pattern) --- */}
                                  <rect
                                    x={windowPaneX}
                                    y={windowPaneY}
                                    width={5}
                                    height={24}
                                    fill="#3b82f6"
                                    stroke="#60a5fa"
                                    strokeWidth={0.5}
                                    rx={1}
                                    className="opacity-90"
                                  />
                                  <line
                                    x1={windowPaneX + 2.5}
                                    y1={windowPaneY}
                                    x2={windowPaneX + 2.5}
                                    y2={windowPaneY + 24}
                                    stroke="#ffffff"
                                    strokeWidth={0.8}
                                    className="opacity-90"
                                  />
                                </g>
                              );
                            })}
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>

              {/* Right Column: Mini HUD active compartment calibrator & WhatsApp solicitation */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-4">
                {/* HUD Active Room Settings */}
                <div className="bg-[#080d19] border border-blue-950 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center pb-2.5 border-b border-blue-950/70">
                    <h6 className="font-extrabold text-[10.5px] text-white uppercase tracking-wider flex items-center gap-1.5">
                      ⚙️ Calibrador de Escala
                    </h6>
                    <span className="bg-blue-500/10 text-blue-400 text-[8.5px] font-bold px-1.5 py-0.5 rounded uppercase font-mono">
                      HUD Ativo
                    </span>
                  </div>

                  {currentActiveRoom ? (
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9.5px] uppercase font-black tracking-widest text-slate-400 mb-0.5">Editar Compartimento:</p>
                        <h4 className="font-extrabold text-[#ff6600] text-sm flex items-center gap-1.5">
                          {currentActiveRoom.name}
                        </h4>
                      </div>

                      {/* Scale Adjusters */}
                      <div className="space-y-3">
                        {/* Width Controls */}
                        <div className="space-y-1.5 bg-[#03060a]/80 p-2.5 rounded-lg border border-blue-950">
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                            <span className="font-bold">LARGURA REAL (↔):</span>
                            <span className="font-black text-white">{currentActiveRoom.width.toFixed(1)} m</span>
                          </div>
                          <div className="flex items-center justify-between gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => updateRoomDimension(currentActiveRoom.id, "width", false)}
                              className="flex-1 py-1 px-2 bg-blue-950 hover:bg-blue-900 border border-blue-900/40 text-gray-300 font-extrabold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center"
                              title="Diminuir largura"
                            >
                              <Minus className="h-3 w-3 mr-0.5" /> 0.5m
                            </button>
                            <button
                              type="button"
                              onClick={() => updateRoomDimension(currentActiveRoom.id, "width", true)}
                              className="flex-1 py-1 px-2 bg-[#ff6600]/85 hover:bg-orange-600 text-white font-extrabold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center"
                              title="Aumentar largura"
                            >
                              <Plus className="h-3 w-3 mr-0.5" /> 0.5m
                            </button>
                          </div>
                        </div>

                        {/* Length Controls */}
                        <div className="space-y-1.5 bg-[#03060a]/80 p-2.5 rounded-lg border border-blue-950">
                          <div className="flex justify-between items-center text-[10px] font-mono text-gray-400">
                            <span className="font-bold">COMPRIMENTO REAL (↕):</span>
                            <span className="font-black text-white">{currentActiveRoom.length.toFixed(1)} m</span>
                          </div>
                          <div className="flex items-center justify-between gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => updateRoomDimension(currentActiveRoom.id, "length", false)}
                              className="flex-1 py-1 px-2 bg-blue-950 hover:bg-blue-900 border border-blue-900/40 text-gray-300 font-extrabold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center"
                              title="Diminuir comprimento"
                            >
                              <Minus className="h-3 w-3 mr-0.5" /> 0.5m
                            </button>
                            <button
                              type="button"
                              onClick={() => updateRoomDimension(currentActiveRoom.id, "length", true)}
                              className="flex-1 py-1 px-2 bg-[#ff6600]/85 hover:bg-orange-600 text-white font-extrabold text-xs rounded-lg transition-all cursor-pointer flex items-center justify-center"
                              title="Aumentar comprimento"
                            >
                              <Plus className="h-3 w-3 mr-0.5" /> 0.5m
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Metrics HUD Box */}
                      <div className="bg-[#111827]/40 p-2.5 rounded-xl border border-white/5 space-y-1">
                        <div className="flex justify-between text-[9px] font-mono text-gray-400">
                          <span>Área Coberta Interna:</span>
                          <span className="font-bold text-blue-400">{(currentActiveRoom.width * currentActiveRoom.length).toFixed(1)} m²</span>
                        </div>
                        <div className="flex justify-between text-[9px] font-mono text-gray-400">
                          <span>Esquadria Recomendada:</span>
                          <span className="text-gray-300 text-right">
                            {currentActiveRoom.type === "suite" ? "Porta 80x210 + Janela standard" : "Vão de Alumínio standard"}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500 text-2xs font-mono text-center py-6">Pressione um compartimento para calibrar</p>
                  )}
                </div>

                {/* WhatsApp Official Request CTA Block */}
                <div className="bg-gradient-to-br from-[#0c2215] via-[#05110a] to-[#020604] border border-emerald-500/25 p-4 rounded-xl space-y-3 text-left">
                  <h5 className="font-extrabold text-[10.5px] uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    Solicitar Planta CAD/PDF
                  </h5>
                  
                  <p className="text-[10px] text-gray-300 leading-normal font-light">
                    Arremate este esboço técnico inteligente com uma **Planta Arquitetónica Oficial Completa (Formatos DWG Autodesk + PDF)** assinada pela Netek Moçambique!
                  </p>

                  <button
                    onClick={handleRequestOfficialBlueprint}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold rounded-lg text-[9.5px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all outline-none border border-emerald-500/20 cursor-pointer shadow-md"
                    title="Exportar dados de volta ao WhatsApp e solicitar Planta Oficial com o Diretor"
                  >
                    <Phone className="h-3.5 w-3.5" /> Encomendar Planta no WhatsApp 📲
                  </button>
                </div>
              </div>
            </div>

            {/* Quick blueprint legends panel */}
            <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap justify-between items-center text-[10px] text-gray-400 gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="flex items-center gap-1">📏 <strong className="text-white">Medições:</strong> Limites de espessura interna ({materialType === "bloco_15" ? "15cm" : "20cm"})</span>
                <span className="flex items-center gap-1">🚪 <strong className="text-white">Portal:</strong> Portas de entrada e isolamentos</span>
                <span className="flex items-center gap-1">🪟 <strong className="text-white">Esquadrias:</strong> Janelas aplicadas por vão de iluminação</span>
              </div>
              <span className="font-mono text-emerald-400 uppercase tracking-widest text-[9px]">
                Pronto para Revisão Técnica
              </span>
            </div>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="p-4 bg-yellow-50 text-yellow-800 border border-yellow-100 rounded-2xl text-xs space-y-1.5 leading-relaxed">
            <h4 className="font-bold flex items-center gap-1.5 text-sm my-0 text-yellow-950">
              <Info className="h-4 w-4 text-yellow-600 animate-bounce" /> NOTA SOBRE AS DIMENSÕES DA PLANTA (⚠️):
            </h4>
            <p>
              Estes cálculos representam estimativas aproximadas baseadas nos coeficientes do Regulamento Geral das Edificações Urbanas (RGEU) de Moçambique. O consumo real de cimento e areia pode sofrer alterações significativas dependendo do lote, consistência do solo, e técnicas aplicadas pelos mestres de obras contratados.
            </p>
            <p className="font-semibold text-yellow-950 leading-normal">
              Recomendamos vivamente que submeta estas estimativas à verificação da nossa equipa profissional ou ao seu Engenheiro de Obra antes da aquisição de materiais no estaleiro.
            </p>
          </div>

          {/* SOLICITATION MESSAGE FORM & WHATSAPP GENERATION (Solicitar via whatsapp ou deixar uma mensagem) */}
          <div className="bg-gradient-to-r from-slate-50 to-orange-50/20 border border-orange-100 rounded-3xl p-6 space-y-5" id="solicitation-request-form">
            <div className="border-b border-orange-100/55 pb-3">
              <h4 className="font-extrabold text-[#2c3e50] text-sm uppercase tracking-wider flex items-center gap-1.5">
                📬 Solicitar Elaboração do Projeto Oficial Completo (CAD / PDF)
              </h4>
              <p className="text-xs text-gray-500 mt-0.5">
                Insira os seus dados de contacto para deixar uma proposta de alteração imediata à nossa equipa técnica, ou para encaminhar diretamente no WhatsApp do Diretor Geral!
              </p>
            </div>

            {formSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center space-y-3"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h5 className="font-bold text-[#2c3e50] text-sm">Mensagem Registada com Sucesso!</h5>
                <p className="text-xs text-gray-650 max-w-md mx-auto leading-relaxed">
                  A sua solicitação de planta técnica com dezenas de vãos dimensionados foi salva no sistema da <strong>Netek Services</strong>. O Diretor Jonson JB e a nossa equipa de Engenharia de Construção já receberam os seus dados e entrarão em contacto muito brevemente.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setFormSuccess(false)}
                    className="py-1.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Enviar Outra Mensagem
                  </button>
                  <a
                    href={`https://wa.me/258835109190?text=${encodeURIComponent(
                      `Olá Diretor Jonson JB! Chamo-me ${clientName || "Cliente"}. Deixei uma mensagem no portal de solicitação de planta técnica com os seguintes detalhes:\n\n` +
                      `- Planta correspondente: ${houseType} (${results.totalArea} m² coberta)\n` +
                      `- Telemóvel: ${clientPhone}\n` +
                      `- Modificações específicas: "${requestedModifications || "Apenas gostaria da planta original com as medidas calculadas."}"\n\n` +
                      `Solicito a validação e elaboração de orçamento profissional pela Netek. Obrigado!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    Confirmar no WhatsApp 📱
                  </a>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleDirectMessageSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-2xs font-bold text-gray-500 uppercase tracking-widest">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ex: Mateus Juvêncio"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#ff6600]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-2xs font-bold text-gray-500 uppercase tracking-widest">
                      Contacto de Celular / WhatsApp *
                    </label>
                    <input
                      type="text"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Ex: +258 84... ou 82/83/85/87..."
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#ff6600]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-2xs font-bold text-gray-500 uppercase tracking-widest">
                    Escreva a sua Mensagem de Solicitação (Modificações ou observações desejadas)
                  </label>
                  <textarea
                    rows={3}
                    value={requestedModifications}
                    onChange={(e) => setRequestedModifications(e.target.value)}
                    placeholder="Ex: Quero que a suite júnior fique perto da garagem, ou pretendo expandir a varanda e incluir teto decorativo..."
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:border-[#ff6600] resize-none"
                  />
                </div>

                {/* Submit Action Buttons inside form */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  {/* Direct Message - Persists database & shows visual checkmark success */}
                  <button
                    type="submit"
                    disabled={isSendingMsg || isLoading}
                    className="flex-1 py-3 px-5 bg-white hover:bg-gray-50 border border-gray-300 hover:border-[#ff6600] text-gray-700 hover:text-gray-900 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSendingMsg ? (
                      <div className="h-4 w-4 border-2 border-[#ff6600] border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Deixar Mensagem de Solicitação 📂
                      </>
                    )}
                  </button>

                  {/* Direct WhatsApp link with prefilled layout details */}
                  <a
                    href={`https://wa.me/258835109190?text=${encodeURIComponent(
                      `Olá Jonson JB! Desenhei uma Planta de Casa "${houseType}" (${results.totalArea} m² de área coberta) no portal Netek Services.\n\n` +
                      `*DADOS DE SOLICITAÇÃO:*\n` +
                      `- Nome do Solicitante: ${clientName || "Interessado"}\n` +
                      `- Celular / WhatsApp: ${clientPhone || "Não especificado"}\n\n` +
                      `*ESTRUTURA DA PLANTA:*\n` +
                      `- Dimensões do Lote: ${terrainDimensions}\n` +
                      `- Nº de Pisos: ${floors}\n` +
                      `- Blocos Recomendados: ${results.blocksCount} un\n` +
                      `- Sacos de Cimento: ${results.cementBags} un\n` +
                      `- Total de Portas Estimadas: ${results.doorsCount} portas\n` +
                      `- Total de Janelas Estimadas: ${results.windowsCount} janelas\n\n` +
                      `*MENSAGEM / ALTERAÇÕES PEDIDAS:*\n` +
                      `"${requestedModifications || "Apenas gostaria da planta original com as medidas calculadas."}"\n\n` +
                      `Pode facultar-me os custos do projeto completo elaboradas em AutoCAD / PDF? Obrigado.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      // Silently store request in firestore alongside opening WhatsApp for superior UX
                      const emailToUse = clientEmail || auth.currentUser?.email || "utilizador.teste@netekservices.co.mz";
                      const roomsCount = rooms.filter(r => r.type === "bedroom" || r.type === "suite").length;
                      addDoc(collection(db, "pedidos_plantas"), {
                        terrainDimensions,
                        houseType,
                        floors,
                        roomsCount,
                        materialType,
                        clientEmail: emailToUse,
                        clientName: clientName || "WhatsApp Direct User",
                        clientPhone: clientPhone || "WhatsApp Link",
                        doorsQty: results.doorsCount,
                        windowsQty: results.windowsCount,
                        requestedModifications,
                        createdAt: Date.now(),
                      }).catch(e => console.error("Logging failed", e));
                    }}
                    className="flex-1 py-3 px-6 bg-[#ff6600] text-white hover:bg-orange-600 rounded-xl text-xs font-extrabold uppercase tracking-widest text-center transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shadow-orange-500/10 hover:shadow-lg"
                  >
                    <Phone className="h-4.5 w-4.5" /> Enviar Planta e Pedido via WhatsApp 📱
                  </a>
                </div>
              </form>
            )}
          </div>

          {/* Core Navigation back buttons */}
          <div className="pt-2 flex justify-start">
            <button
              onClick={resetForm}
              className="px-5 py-2 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-xl text-xs font-semibold cursor-pointer"
            >
              ← Voltar ao Começo
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
