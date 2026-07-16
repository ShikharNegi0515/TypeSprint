import { AiProvider } from '../interfaces/ai-provider.interface';

type TextBank = Record<string, Record<string, string[]>>;

const TEXT_BANK: TextBank = {
  programming: {
    easy: [
      'a function is a block of code that runs when it is called you can pass data known as parameters into a function',
      'variables store data values and in python variables are created when you assign a value to them',
      'a loop is used for iterating over a sequence like a list tuple dictionary or a set of characters',
      'comments are used to explain code and make it more readable they are ignored by the computer when running code',
      'an array is a data structure that can hold more than one value at a time it is very useful in programming',
    ],
    medium: [
      'recursion is a programming technique where a function calls itself with a modified argument until it reaches a base case that stops the recursion',
      'object oriented programming is a programming paradigm that organizes software design around data or objects rather than functions and logic',
      'asynchronous programming allows a program to start a potentially long running task and still be able to respond to other events while that task runs',
      'a hash map is a data structure that implements an associative array abstract data type and maps keys to values using a hash function',
      'dependency injection is a design pattern where components receive their dependencies from external sources rather than creating them internally',
    ],
    hard: [
      'monadic composition in functional programming allows developers to chain operations in a type safe manner where each step may produce a computational context such as optionality or side effects without collapsing the abstraction',
      'the time complexity of a well balanced binary search tree guarantees logarithmic lookup insertion and deletion operations making it fundamentally superior to linear search in large datasets where cache efficiency is not the bottleneck',
      'transactional memory provides an optimistic concurrency control mechanism that executes code speculatively and commits only if no conflicts are detected during the execution window thereby avoiding the deadlock problem inherent in mutex based synchronization primitives',
      'abstract syntax trees are hierarchical representations of source code that compilers use during the parsing phase to enforce grammar rules before generating intermediate representation for subsequent optimization and code generation passes',
      'the actor model of concurrency treats actors as the universal primitives of concurrent computation where each actor processes messages sequentially from its mailbox and can create new actors send messages and determine how to respond to the next message',
    ],
  },
  technology: {
    easy: [
      'the internet is a global network of computers connected together sharing information and resources',
      'a smartphone is a mobile device that combines the functions of a mobile phone and a computer',
      'cloud computing means storing and accessing data and programs over the internet instead of your local computer',
      'wifi allows devices to connect to the internet wirelessly using radio waves transmitted by a router',
      'an operating system is the most important software that runs on a computer managing all programs and hardware',
    ],
    medium: [
      'containerization technology like docker allows developers to package applications with all their dependencies ensuring consistent behavior across different computing environments and simplifying deployment pipelines',
      'edge computing brings computation and data storage closer to the sources of data reducing latency and bandwidth usage compared to traditional cloud computing architectures',
      'microservices architecture structures an application as a collection of small loosely coupled services that communicate over well defined apis enabling independent deployment and scaling',
      'machine learning enables systems to automatically learn and improve from experience without being explicitly programmed by identifying patterns in large datasets and making intelligent decisions',
      'blockchain technology creates a distributed ledger that records transactions across many computers so that the record cannot be altered retroactively without alteration of all subsequent blocks',
    ],
    hard: [
      'quantum computing exploits quantum mechanical phenomena such as superposition and entanglement to process information in fundamentally different ways from classical binary computers enabling exponential speedups for specific problem classes like integer factorization and database search',
      'neuromorphic computing architectures emulate the structure and function of biological neural networks at the hardware level creating processors that perform pattern recognition and inference tasks with dramatically lower power consumption than conventional von neumann architectures',
      'homomorphic encryption enables computation on encrypted data without decrypting it first allowing cloud services to process sensitive information while providing cryptographic guarantees of privacy that cannot be compromised even by the service provider itself',
      'federated learning distributes the model training process across multiple decentralized devices holding local data samples without exchanging raw data addressing privacy and bandwidth concerns while still enabling collaborative improvement of machine learning models',
      'software defined networking decouples the network control plane from the data forwarding plane enabling centralized programmatic control of network behavior and dynamic reconfiguration of routing policies without manual intervention on individual network devices',
    ],
  },
  history: {
    easy: [
      'the ancient egyptians built the great pyramids as tombs for their pharaohs over four thousand years ago',
      'the roman empire was one of the largest empires in history lasting for over a thousand years',
      'world war two ended in nineteen forty five after the defeat of nazi germany and imperial japan',
      'christopher columbus sailed across the atlantic ocean in fourteen ninety two and reached the americas',
      'the industrial revolution began in britain in the eighteenth century and transformed manufacturing forever',
    ],
    medium: [
      'the renaissance was a cultural movement that began in italy in the fourteenth century and spread throughout europe transforming art science and literature through a rediscovery of classical greco roman philosophy',
      'the french revolution which began in seventeen eighty nine fundamentally transformed political power in france overthrowing the monarchy establishing a republic and inspiring democratic movements throughout europe and the americas',
      'the silk road was an ancient network of trade routes connecting china to the mediterranean world facilitating not only commerce but also the exchange of culture religion art and technology between east and west',
      'the cold war was a period of geopolitical tension between the united states and soviet union following world war two characterized by proxy conflicts ideological competition and the constant threat of nuclear warfare',
      'the british empire at its height in the early twentieth century was the largest empire in history controlling roughly a quarter of the worlds land surface and governing hundreds of millions of people across every continent',
    ],
    hard: [
      'the peace of westphalia signed in sixteen forty eight established the foundational principles of state sovereignty and non interference in internal affairs that continue to underpin the modern international order despite the subsequent development of humanitarian intervention doctrines',
      'the triangular trade system created an economic network linking europe africa and the americas through the exchange of manufactured goods enslaved africans and raw materials fundamentally shaping demographic cultural and economic trajectories across three continents for centuries',
      'the decline of the byzantine empire culminating in the ottoman conquest of constantinople in fourteen fifty three accelerated the westward migration of greek scholars whose knowledge of classical texts contributed significantly to the european renaissance and the recovery of ancient philosophy',
      'the meiji restoration of eighteen sixty eight transformed japan from a feudal society under shogunal rule into a centralized nation state that selectively adopted western institutions technology and military organization while deliberately preserving elements of japanese cultural and imperial tradition',
      'the congress of vienna convened after napoleon bonapartes defeat established a concert of europe mechanism for managing great power relations that maintained relative continental stability for nearly a century until the systemic failures exposed by the july crisis of nineteen fourteen',
    ],
  },
  science: {
    easy: [
      'the water cycle describes how water moves from the surface of the earth to the atmosphere and back again',
      'photosynthesis is the process by which plants use sunlight water and carbon dioxide to produce food and oxygen',
      'gravity is the force that attracts objects toward one another and keeps planets in orbit around the sun',
      'cells are the basic building blocks of all living things and every living organism is made up of cells',
      'the periodic table organizes chemical elements by their atomic number and chemical properties',
    ],
    medium: [
      'deoxyribonucleic acid is a molecule that contains the genetic instructions for the development functioning growth and reproduction of all known organisms and many viruses',
      'the theory of evolution by natural selection proposed by charles darwin explains how species change over time through the differential survival and reproduction of individuals with advantageous traits',
      'einsteins general theory of relativity describes gravity not as a force but as the curvature of spacetime caused by mass and energy fundamentally changing our understanding of gravity and the cosmos',
      'quantum mechanics describes the behavior of matter and energy at the smallest scales where particles exhibit wave like properties and their states are described by probability distributions rather than definite values',
      'the human immune system comprises two main branches the innate immune system which provides immediate nonspecific defense and the adaptive immune system which develops targeted responses to specific pathogens through antibody production',
    ],
    hard: [
      'the standard model of particle physics describes three of the four known fundamental forces and classifies all known elementary particles into fermions which constitute matter and bosons which mediate interactions yet conspicuously fails to incorporate gravitational interactions described by general relativity',
      'epigenetic mechanisms including dna methylation histone modification and noncoding rna regulation alter gene expression patterns without changing the underlying nucleotide sequence creating heritable phenotypic variation that challenges strictly sequence centric views of inheritance and development',
      'the second law of thermodynamics states that the total entropy of an isolated system can never decrease over time implying a fundamental asymmetry in physical processes that underlies the arrow of time and the impossibility of perpetual motion machines of the second kind',
      'crispr cas9 genome editing technology exploits a bacterial adaptive immune mechanism that uses guide rna molecules to direct the cas9 endonuclease to specific dna sequences enabling precise genome modifications with applications ranging from functional genomics to therapeutic correction of genetic disorders',
      'the measurement problem in quantum mechanics concerns the apparent contradiction between the smooth deterministic evolution of quantum states described by the schrodinger equation and the abrupt probabilistic collapse that occurs upon observation challenging interpretations of physical reality at the fundamental level',
    ],
  },
  literature: {
    easy: [
      'a novel is a long work of fiction that tells a story and usually has multiple characters and a complex plot',
      'poetry uses rhythm rhyme and imagery to express ideas and emotions in a concentrated and artistic way',
      'shakespeare wrote thirty seven plays and one hundred and fifty four sonnets and is considered the greatest writer in the english language',
      'a metaphor is a figure of speech that describes something as though it were something else to highlight a quality',
      'the protagonist is the main character in a story who usually faces a central conflict or challenge',
    ],
    medium: [
      'the stream of consciousness technique pioneered by james joyce and virginia woolf attempts to depict the multitudinous thoughts and feelings that pass through a characters mind giving the reader direct access to the interior psychological experience',
      'magical realism is a literary style in which magical elements appear as natural occurrences in an otherwise realistic setting most prominently used by latin american writers like gabriel garcia marquez to explore the tensions between rational modernity and traditional mythological worldviews',
      'the unreliable narrator is a narrative device where the credibility of the storyteller is compromised inviting readers to question the account being given and draw independent conclusions about the actual events underlying the narration',
      'modernist literature emerged in the late nineteenth and early twentieth centuries as writers rejected traditional narrative forms and experimented with fragmented timelines multiple perspectives and interior monologue to reflect the disorienting experience of modern life',
      'dystopian fiction imagines future societies characterized by oppression conformity and the systematic suppression of individual freedom serving as cautionary tales about the dangers of totalitarianism technological dehumanization and unchecked political power',
    ],
    hard: [
      'intertextuality as theorized by julia kristeva describes the phenomenon whereby every text is shaped by a mosaic of conscious and unconscious references to other texts blurring authorial originality and situating meaning production within a network of cultural signification rather than in any single autonomous work',
      'the narrative technique of free indirect discourse merges the perspectives of the narrator and a character allowing the authors voice to inhabit the characters consciousness without formal attribution creating an ambiguity that readers must actively navigate to construct meaning',
      'postcolonial literary theory examines the complex cultural negotiations inherent in literatures produced by societies that experienced colonialism interrogating how western canonical forms were imposed adopted subverted and transformed in the articulation of non western identities and historical experiences',
      'the bildungsroman genre which traces the psychological and moral growth of a protagonist from youth to adulthood encodes enlightenment assumptions about individual selfhood and rational development that later authors have critically revised by subjecting the genre conventions to ironic deconstruction or formal fragmentation',
      'the carnivalesque as analyzed by mikhail bakhtin describes a subversive literary mode derived from medieval carnival traditions that temporarily inverts social hierarchies celebrates bodily excess and mobilizes laughter as a philosophical force against the monological authority of official culture',
    ],
  },
  general: {
    easy: [
      'exercise is important for maintaining good health and helps reduce the risk of many diseases',
      'reading books every day helps improve vocabulary focus and general knowledge',
      'the sun rises in the east and sets in the west because the earth rotates from west to east',
      'cooking at home is generally healthier and more affordable than eating at restaurants',
      'getting enough sleep each night is essential for memory consolidation mood regulation and physical health',
    ],
    medium: [
      'the global economy is increasingly interconnected with supply chains spanning multiple continents meaning that disruptions in one region can rapidly cascade into shortages and price increases felt by consumers worldwide',
      'urban planning involves balancing competing demands for housing transportation green space and commercial development while addressing issues of equity affordability and environmental sustainability in growing cities',
      'mindfulness meditation has been shown through numerous scientific studies to reduce symptoms of anxiety depression and chronic pain by training practitioners to observe thoughts without judgment and maintain present moment awareness',
      'the scientific method involves forming hypotheses designing controlled experiments collecting data analyzing results and revising theories based on evidence ensuring that our knowledge of the world is continuously refined through rigorous testing',
      'social media has transformed how people communicate share information and form communities while simultaneously raising concerns about privacy misinformation mental health and the concentration of power in technology platforms',
    ],
    hard: [
      'the philosophical problem of consciousness remains one of the most intractable questions in science and philosophy concerning how and why physical processes in the brain give rise to subjective qualitative experience including the hard problem of explaining why there is something it is like to be a sentient creature',
      'behavioral economics demonstrates through empirical research that human decision making systematically deviates from the rational actor model assumed in classical economic theory revealing consistent cognitive biases heuristics and framing effects that influence choices in predictable but often suboptimal ways',
      'the tragedy of the commons describes situations in which individual users acting independently and rationally according to their own self interest behave contrary to the common good by depleting shared resources through their collective action requiring institutional solutions like regulation property rights or cooperative governance',
      'epistemological questions about the nature and limits of human knowledge form the foundation of philosophical inquiry with rationalists arguing that certain knowledge derives from reason alone while empiricists contend that all knowledge ultimately originates in sensory experience shaped by conceptual frameworks',
      'the demographic transition model describes how countries typically progress through stages of high birth and death rates through a period of rapid population growth to eventual stabilization as economic development improved healthcare and education increase life expectancy and reduce fertility rates',
    ],
  },
};

export class MockAiProvider extends AiProvider {
  async generateText(category: string, difficulty: string): Promise<string> {
    const categoryBank = TEXT_BANK[category] || TEXT_BANK['general'];
    const difficultyBank = categoryBank[difficulty] || categoryBank['medium'];
    const index = Math.floor(Math.random() * difficultyBank.length);
    return difficultyBank[index];
  }
}
