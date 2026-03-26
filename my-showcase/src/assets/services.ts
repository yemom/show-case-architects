export type ServiceItem = {
  slug: string;
  title: string;
  icon: "Building" | "Home" | "Palette" | "Box" | "Wrench" | "Users";
  description: string;
  features: string[];
  price: string;
  longDescription: string;
  buildSteps?: { title: string; content: string }[];
  materials?: { category: string; items: string[] }[];
  furnishings?: { area: string; items: string[] }[];
  deliverables?: string[];
};

export const services: ServiceItem[] = [
  {
    slug: "architectural-design",
    title: "Architectural Design",
    icon: "Building",
    description:
      "Complete architectural solutions from concept to construction, specializing in modern, sustainable design.",
    features: [
      "Conceptual Design",
      "Technical Drawings",
      "3D Visualization",
      "Permit Processing",
    ],
    price: "Starting at $15,000",
    longDescription:
      "From site analysis and programming to construction documents, our architectural design service delivers end‑to‑end solutions. We balance aesthetics, function, sustainability, and budget—backed by clear coordination with consultants and authorities for a smooth approval process.",
    buildSteps: [
      { title: "Discovery & Brief", content: "Workshops to define goals, constraints, budget, and schedule; site and zoning analysis." },
      { title: "Concept Design", content: "Plan studies, massing, and options; preliminary structural and MEP coordination." },
      { title: "Design Development", content: "Detail the preferred scheme; refine materials, envelope, and building systems." },
      { title: "Construction Docs", content: "Full drawing set and specs for tender/permits; coordinate with consultants." },
      { title: "Tender & CA", content: "Bid support, RFIs, submittals, and site reviews for quality and compliance." },
    ],
    materials: [
      { category: "Structure", items: ["Reinforced concrete slabs/beams", "Steel frames where spans require", "CMU infill where applicable"] },
      { category: "Envelope", items: ["High‑performance glazing (low‑E)", "Rainscreen cladding (fiber‑cement or metal)", "Stone or brick accents"] },
      { category: "Sustainability", items: ["Insulation to local code+", "Solar shading strategies", "Low‑VOC adhesives/paints"] },
    ],
    furnishings: [
      { area: "Lobby/Public", items: ["Durable modular seating", "Custom reception desk", "Wayfinding & signage"] },
    ],
    deliverables: ["Full drawing set (plans, sections, details)", "Specifications", "Schedules", "3D visuals", "Permit package"],
  },
  {
    slug: "residential-design",
    title: "Residential Design",
    icon: "Home",
    description:
      "Custom home design that reflects your lifestyle and maximizes comfort, functionality, and value.",
    features: [
      "Custom Home Design",
      "Renovation Planning",
      "Space Optimization",
      "Interior Layout",
    ],
    price: "Starting at 50,000 birr",
    longDescription:
      "We craft homes that fit the way you live—from layout and circulation to materials and light. Whether new build or renovation, we design with durability and timelessness in mind, coordinating with builders and vendors to make the process stress‑free.",
    buildSteps: [
      { title: "Lifestyle Interview", content: "Understand routines, storage needs, and style references; measure existing conditions if needed." },
      { title: "Space Planning", content: "Optimize room adjacencies, daylight, and circulation; propose structural implications." },
      { title: "Selections", content: "Cabinetry, flooring, fixtures, and hardware; create mood boards and samples." },
      { title: "Documentation", content: "Dimensioned plans/elevations, electrical/lighting plans, and joinery details." },
      { title: "Build Oversight", content: "Site coordination and punch‑list to ensure design intent." },
    ],
    materials: [
      { category: "Floors", items: ["Engineered oak / porcelain tile", "Acoustic underlay for upper levels"] },
      { category: "Kitchens", items: ["Plywood carcasses", "Quartz or sintered stone tops", "Soft‑close hardware"] },
      { category: "Baths", items: ["Porcelain tile (matte R10+)", "Solid‑surface tops", "Brass or SS fixtures"] },
    ],
    furnishings: [
      { area: "Living", items: ["Sofa 2.2–2.6m", "Occasional chairs", "Rug 2x3m", "Media console with cable management"] },
      { area: "Bedroom", items: ["Bed frame + upholstered headboard", "Wardrobe with internal organizers", "Task & ambient lighting"] },
    ],
    deliverables: ["Plans/elevations", "Lighting plan", "Joinery details", "FF&E list", "Render set"],
  },
  {
    slug: "interior-design",
    title: "Interior Design",
    icon: "Palette",
    description:
      "Transform your spaces with thoughtful interior design that balances aesthetics and functionality.",
    features: ["Space Planning", "Material Selection", "Furniture Design", "Color Consultation"],
    price: "Starting at 85,000 birr",
    longDescription:
      "From mood boards and FF&E to detailed joinery drawings and on‑site styling, our interiors are crafted for everyday life. We optimize proportion, storage, and experience—delivering renders and samples so you can visualize early.",
    buildSteps: [
      { title: "Brief & Mood", content: "Collect references and define palette; survey and measure spaces." },
      { title: "Space Planning", content: "Test layouts and circulation; ensure ergonomic clearances and lighting." },
      { title: "FF&E + Finishes", content: "Specify furniture, fabrics, rugs, wall/ceiling finishes, and window treatments." },
      { title: "Joinery Details", content: "Custom millwork with sections, materials, and hardware; coordinate shop drawings." },
      { title: "Styling & Handover", content: "On‑site styling and final adjustments; maintenance notes and care guide." },
    ],
    materials: [
      { category: "Finishes", items: ["Limewash / low‑VOC paints", "Textured wall panels", "Solid wood trims"] },
      { category: "Surfaces", items: ["Quartz / sintered stone", "Wood veneer cabinetry", "Microcement in wet areas (with waterproofing)"] },
      { category: "Lighting", items: ["Warm 2700–3000K LEDs", "Dimmers and layered lighting", "Accent spots for art"] },
    ],
    furnishings: [
      { area: "Living", items: ["Modular sofa", "Coffee table 1.2–1.4m", "Side tables", "Table/floor lamps", "Curtains or sheers"] },
      { area: "Dining", items: ["6–8 seater table (min 900mm deep)", "Upholstered chairs", "Pendant lighting centered on table"] },
      { area: "Work Nook", items: ["Desk 1200mm", "Ergonomic chair", "Cable management", "Task lighting"] },
    ],
    deliverables: ["Mood boards", "Plans/elevations", "Joinery details", "FF&E schedule", "Render set", "Care guide"],
  },
  {
    slug: "3d-modeling-visualization",
    title: "3D Modeling & Visualization",
    icon: "Box",
    description:
      "Photorealistic renderings and virtual walkthroughs to help you visualize your project before construction.",
    features: ["3D Renderings", "Virtual Tours", "Animation", "VR Experiences"],
    price: "Starting at 50,000 birr",
    longDescription:
      "We produce high‑quality renders and animations for concept validation, marketing, and approvals. Experience your spaces with accurate materials, lighting, and scale—reducing surprises during construction.",
    buildSteps: [
      { title: "Inputs & Brief", content: "Collect CAD/PDFs, sketches, references; define camera views and mood." },
      { title: "Modeling", content: "Build accurate geometry and joinery; verify dimensions with client." },
      { title: "Materials/Lighting", content: "Apply shaders, HDRI/area lights; iterate until approved." },
      { title: "Rendering", content: "High‑res stills + optional animation; post‑production color and contrast." },
    ],
    materials: [
      { category: "Delivery Formats", items: ["4K stills (PNG/JPG)", "MP4 animations", "360° panos", "VR tour exports"] },
    ],
    furnishings: [
      { area: "Model Library", items: ["High‑poly furniture assets", "PBR material library", "Proxy assets for speed"] },
    ],
    deliverables: ["Image set", "Animation (optional)", "Source files on request", "One revision round included"],
  },
  {
    slug: "renovation-restoration",
    title: "Renovation & Restoration",
    icon: "Wrench",
    description:
      "Breathe new life into existing spaces while preserving architectural integrity and character.",
    features: [
      "Historic Restoration",
      "Modern Updates",
      "Structural Analysis",
      "Code Compliance",
    ],
    price: "Starting at 100,000 birr",
    longDescription:
      "From historic buildings to modern refreshes, we plan upgrades that respect context while meeting current needs. Our team coordinates permits, details, and construction sequencing for efficient delivery.",
    buildSteps: [
      { title: "Survey & Assessment", content: "Document existing conditions; structural, moisture, and code review." },
      { title: "Scope & Phasing", content: "Define priorities, temporary works, and sequencing to minimize downtime." },
      { title: "Detailing", content: "Repair details, matching profiles and finishes where heritage applies." },
      { title: "Execution", content: "Monitor works, approvals, and quality, with periodic site visits." },
    ],
    materials: [
      { category: "Restoration", items: ["Lime mortars/plasters", "Timber repairs with epoxy splices", "Reclaimed bricks/stone"] },
      { category: "Upgrades", items: ["Efficient glazing upgrades", "LED retrofits", "Water‑saving fixtures"] },
    ],
    furnishings: [
      { area: "Blended Old & New", items: ["Refinished vintage pieces", "Custom cabinetry matching era", "Contemporary lighting"] },
    ],
    deliverables: ["Measured drawings", "Phasing plan", "Detail sheets", "Permit package", "Finish schedules"],
  },
  {
    slug: "consulting-services",
    title: "Consulting Services",
    icon: "Users",
    description:
      "Expert architectural consultation for planning, feasibility studies, and project development.",
    features: ["Feasibility Studies", "Design Review", "Code Analysis", "Project Planning"],
    price: "Starting at 2,000 birr/hour",
    longDescription:
      "Get clarity on scope, timelines, costs, and approvals. We review plans, analyze codes, and provide decision‑ready insights—ideal for early‑stage projects and investors.",
    buildSteps: [
      { title: "Kickoff & Brief", content: "Clarify objectives, constraints, and decision criteria; gather documents." },
      { title: "Analysis", content: "Code, zoning, and constructability review; identify risks and opportunities." },
      { title: "Recommendations", content: "Report with options, budgets, and next steps; Q&A workshop." },
    ],
    materials: [
      { category: "Outputs", items: ["Annotated mark‑ups", "Risk register", "High‑level budget ranges", "Approval pathway outline"] },
    ],
    furnishings: [
      { area: "N/A", items: ["Consulting deliverables only"] },
    ],
    deliverables: ["Summary report", "Annotated drawings", "Budget ranges", "Action plan"],
  },
];
