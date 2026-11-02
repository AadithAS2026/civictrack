import { Complaint, CivicNotification } from '../types';

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'CT-2026-8942',
    title: 'Severe Clogged Storm Drain Causing Street Flooding',
    description: 'During yesterday evening rainfall, storm water accumulated up to knee height near the bus stop. Fallen leaves and plastic trash have completely choked the underground storm inlet.',
    category: 'drainage',
    status: 'in_progress',
    severity: 'critical',
    latitude: 40.7185,
    longitude: -74.0082,
    address: '428 Grand Ave, near Cross Street Bus Station',
    landmark: 'Directly in front of Metro Bus Stand 14',
    ward: 'Ward 18 - Central Market & Commercial',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1000&q=80',
    reporterName: 'Marcus Vance',
    reporterContact: 'marcus.v@example.com',
    isAnonymous: false,
    createdAt: '2026-11-01T09:30:00.000Z',
    updatedAt: '2026-11-02T11:15:00.000Z',
    upvotes: 42,
    userHasUpvoted: false,
    assignedDepartment: 'Water Supply & Sewerage',
    assignedOfficer: 'Chief Inspector David Ramirez',
    estimatedResolutionHours: 24,
    timeline: [
      {
        id: 't-1',
        status: 'submitted',
        title: 'Complaint Registered',
        description: 'Resident Marcus Vance reported drainage blockage with geotagged photo proof.',
        timestamp: '2026-11-01T09:30:00.000Z'
      },
      {
        id: 't-2',
        status: 'under_review',
        title: 'Assigned to Drainage Squad',
        description: 'Ward 18 drainage superintendent flagged priority as Critical due to peak bus commuter footfall.',
        timestamp: '2026-11-01T12:45:00.000Z',
        officerName: 'David Ramirez',
        department: 'Water Supply & Sewerage'
      },
      {
        id: 't-3',
        status: 'in_progress',
        title: 'Suction Jet Machine Dispatched',
        description: 'High-pressure vacuum de-silting crew arrived on site at 10:30 AM. Clearance of storm sewer in progress.',
        timestamp: '2026-11-02T10:30:00.000Z',
        officerName: 'Crew Lead Robert Kowalski',
        department: 'Water Supply & Sewerage'
      }
    ],
    comments: [
      {
        id: 'c-1',
        authorName: 'Sarah Jenkins',
        authorRole: 'resident',
        text: 'This happens every time it rains! The entire pedestrian crossing is submerged, please clear this quickly.',
        createdAt: '2026-11-01T10:15:00.000Z'
      },
      {
        id: 'c-2',
        authorName: 'David Ramirez (Municipal Inspector)',
        authorRole: 'authority',
        text: 'Suction truck #4 is actively unblocking the primary 24-inch trunk line right now. Estimated completion by 4:00 PM today.',
        createdAt: '2026-11-02T11:15:00.000Z'
      }
    ]
  },
  {
    id: 'CT-2026-8935',
    title: 'Dangerous Deep Crater Pothole on Curve',
    description: 'A 6-inch deep pothole has expanded over the weekend on the right lane curve. Two cyclists and a delivery scooter have already slipped. Needs urgent asphalt cold mix patching.',
    category: 'pothole',
    status: 'under_review',
    severity: 'high',
    latitude: 40.7142,
    longitude: -74.0135,
    address: 'Corner of Hudson & West 11th Street',
    landmark: 'Opposite St. Jude Community Health Clinic',
    ward: 'Ward 12 - Downtown Metro',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=1000&q=80',
    reporterName: 'Priya Sharma',
    reporterContact: 'priya.s@example.org',
    isAnonymous: false,
    createdAt: '2026-11-01T14:20:00.000Z',
    updatedAt: '2026-11-01T16:00:00.000Z',
    upvotes: 67,
    userHasUpvoted: true,
    assignedDepartment: 'Public Works & Roads',
    assignedOfficer: 'Engineer Alan Gomez',
    estimatedResolutionHours: 48,
    timeline: [
      {
        id: 't-4',
        status: 'submitted',
        title: 'Pothole Reported by Resident',
        description: 'Detailed hazard report lodged with GPS location accurate to 3 meters.',
        timestamp: '2026-11-01T14:20:00.000Z'
      },
      {
        id: 't-5',
        status: 'under_review',
        title: 'Road Maintenance Triage',
        description: 'Assigned to Downtown Asphalt Emergency Repair roster. Temporary traffic cones deployed.',
        timestamp: '2026-11-01T16:00:00.000Z',
        officerName: 'Alan Gomez',
        department: 'Public Works & Roads'
      }
    ],
    comments: [
      {
        id: 'c-3',
        authorName: 'Tom Bradley',
        authorRole: 'resident',
        text: 'Upvoted! Hit this pothole on my bicycle this morning, bent my front wheel. Please patch it soon.',
        createdAt: '2026-11-01T15:40:00.000Z'
      }
    ]
  },
  {
    id: 'CT-2026-8910',
    title: 'Solid Waste Bin Overflow & Illegal Street Dumping',
    description: 'Community dumpster has not been emptied for 4 days. Waste bags are overflowing onto the pedestrian footpath, attracting stray animals and generating heavy odor.',
    category: 'garbage',
    status: 'in_progress',
    severity: 'high',
    latitude: 40.7220,
    longitude: -73.9980,
    address: '89 Mulberry Way, Residential Block C',
    landmark: 'Behind Greenfield Primary School Playground',
    ward: 'Ward 15 - North Park & Greenfield',
    imageUrl: 'https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=1000&q=80',
    reporterName: 'Anonymous Resident',
    isAnonymous: true,
    createdAt: '2026-10-31T08:00:00.000Z',
    updatedAt: '2026-11-02T08:30:00.000Z',
    upvotes: 38,
    userHasUpvoted: false,
    assignedDepartment: 'Solid Waste Management',
    assignedOfficer: 'Sanitation Officer Elena Rostova',
    estimatedResolutionHours: 12,
    timeline: [
      {
        id: 't-6',
        status: 'submitted',
        title: 'Sanitation Complaint Logged',
        description: 'Anonymous report submitted regarding overflowing community bins.',
        timestamp: '2026-10-31T08:00:00.000Z'
      },
      {
        id: 't-7',
        status: 'under_review',
        title: 'Sanitation Route Re-routing',
        description: 'Supervisor verified backlog caused by mechanical breakdown of compactor truck #12.',
        timestamp: '2026-10-31T11:00:00.000Z',
        officerName: 'Elena Rostova',
        department: 'Solid Waste Management'
      },
      {
        id: 't-8',
        status: 'in_progress',
        title: 'Compactor Vehicle Dispatched',
        description: 'Emergency reserve hydraulic compactor dispatched to clean and disinfect the corner.',
        timestamp: '2026-11-02T08:30:00.000Z',
        officerName: 'Sanitation Shift Supervisor',
        department: 'Solid Waste Management'
      }
    ],
    comments: [
      {
        id: 'c-4',
        authorName: 'Elena Rostova (Sanitation Officer)',
        authorRole: 'authority',
        text: 'Crew is on site right now. Secondary 4-yard roll-off bin is also being installed here to prevent overflow in the future.',
        createdAt: '2026-11-02T09:00:00.000Z'
      }
    ]
  },
  {
    id: 'CT-2026-8889',
    title: 'High-Pressure Water Main Leak Under Pavement',
    description: 'Clean drinking water is gushing out from cracked asphalt at approximately 50 gallons per minute. Pavement is visibly buckling and creating a sinkhole risk.',
    category: 'water_leakage',
    status: 'in_progress',
    severity: 'critical',
    latitude: 40.7090,
    longitude: -74.0020,
    address: '15 Wallaby Boulevard, Financial Fringe',
    landmark: 'Near Metro Electric Substation 3',
    ward: 'Ward 12 - Downtown Metro',
    imageUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1000&q=80',
    reporterName: 'Carlos Mendez',
    reporterContact: 'carlos.m@example.com',
    isAnonymous: false,
    createdAt: '2026-11-02T06:15:00.000Z',
    updatedAt: '2026-11-02T07:45:00.000Z',
    upvotes: 94,
    userHasUpvoted: true,
    assignedDepartment: 'Water Supply & Sewerage',
    assignedOfficer: 'Chief Hydrologist Kenneth Brooks',
    estimatedResolutionHours: 8,
    timeline: [
      {
        id: 't-9',
        status: 'submitted',
        title: 'Emergency Leak Flagged',
        description: 'Geotagged high pressure water leak report submitted by Carlos Mendez.',
        timestamp: '2026-11-02T06:15:00.000Z'
      },
      {
        id: 't-10',
        status: 'in_progress',
        title: 'Main Isolation Valve Shut Off',
        description: 'Rapid response valve team isolated the 8-inch feeder pipe. Heavy excavation machinery on site.',
        timestamp: '2026-11-02T07:45:00.000Z',
        officerName: 'Kenneth Brooks',
        department: 'Water Supply & Sewerage'
      }
    ],
    comments: [
      {
        id: 'c-5',
        authorName: 'Carlos Mendez',
        authorRole: 'resident',
        text: 'Thank you for the quick valve isolation! Water pressure in our building dipped, but at least the street isn’t washing away anymore.',
        createdAt: '2026-11-02T08:10:00.000Z'
      }
    ]
  },
  {
    id: 'CT-2026-8850',
    title: 'Cluster of 4 Broken LED Streetlights on Walkway',
    description: 'Four consecutive LED luminaires on the residential pedestrian greenway are completely dark. Women commuters and elderly residents feel unsafe walking after 7 PM.',
    category: 'streetlight',
    status: 'resolved',
    severity: 'medium',
    latitude: 40.7265,
    longitude: -74.0045,
    address: 'Greenway Promenade, between Post 45 & 49',
    landmark: 'Adjacent to North Park Jogging Track',
    ward: 'Ward 15 - North Park & Greenfield',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1000&q=80',
    resolvedImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80',
    resolutionNotes: 'Replaced faulty photo-electric control sensor and two 80W LED driver modules. All 4 poles tested and operational with timer sync.',
    resolvedAt: '2026-11-01T20:30:00.000Z',
    reporterName: 'Ananya Patel',
    reporterContact: 'ananya.p@example.com',
    isAnonymous: false,
    createdAt: '2026-10-29T19:00:00.000Z',
    updatedAt: '2026-11-01T20:30:00.000Z',
    upvotes: 51,
    userHasUpvoted: false,
    assignedDepartment: 'Electricity & Street Lighting',
    assignedOfficer: 'Senior Electrician Liam Zhao',
    timeline: [
      {
        id: 't-11',
        status: 'submitted',
        title: 'Lighting Fault Logged',
        description: 'Resident report received with exact pole identification numbers.',
        timestamp: '2026-10-29T19:00:00.000Z'
      },
      {
        id: 't-12',
        status: 'under_review',
        title: 'Department Assigned',
        description: 'Electrical maintenance ticket generated.',
        timestamp: '2026-10-30T09:15:00.000Z',
        officerName: 'Liam Zhao',
        department: 'Electricity & Street Lighting'
      },
      {
        id: 't-13',
        status: 'in_progress',
        title: 'Bucket Truck Dispatched',
        description: 'Aerial lift truck deployed with replacement LED fixtures.',
        timestamp: '2026-11-01T17:00:00.000Z',
        officerName: 'Liam Zhao',
        department: 'Electricity & Street Lighting'
      },
      {
        id: 't-14',
        status: 'resolved',
        title: 'Resolved & Tested',
        description: 'Replaced photo-electric control sensor and drivers. Resolution proof image verified.',
        timestamp: '2026-11-01T20:30:00.000Z',
        officerName: 'Liam Zhao',
        department: 'Electricity & Street Lighting',
        proofImageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80'
      }
    ],
    comments: [
      {
        id: 'c-6',
        authorName: 'Ananya Patel',
        authorRole: 'resident',
        text: 'Confirming the lights are working brightly tonight! Huge relief for everyone walking home from the train.',
        createdAt: '2026-11-01T21:10:00.000Z'
      }
    ]
  },
  {
    id: 'CT-2026-8815',
    title: 'Large Fallen Oak Branch Blocking Two-Way Bike Lane',
    description: 'Wind gusts from Sunday storm snapped a large 15-foot limb from an old oak tree. The bike lane and half of the right traffic lane are obstructed.',
    category: 'fallen_tree',
    status: 'resolved',
    severity: 'medium',
    latitude: 40.7112,
    longitude: -74.0165,
    address: 'Battery Park Boulevard West, Pier 25 Approach',
    landmark: 'Opposite Ferry Pier 25 entrance',
    ward: 'Ward 22 - West Riverdale & Harbor',
    imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1000&q=80',
    resolvedImageUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=1000&q=80',
    resolutionNotes: 'Horticulture crew cut the limb into manageable logs using chainsaws and cleared all debris with wood chipper. Lane fully reopened.',
    resolvedAt: '2026-10-31T15:20:00.000Z',
    reporterName: 'Felix Dupont',
    reporterContact: 'felix.d@example.org',
    isAnonymous: false,
    createdAt: '2026-10-31T11:00:00.000Z',
    updatedAt: '2026-10-31T15:20:00.000Z',
    upvotes: 29,
    userHasUpvoted: false,
    assignedDepartment: 'Parks & Urban Forestry',
    assignedOfficer: 'Arborist Nathan Cole',
    timeline: [
      {
        id: 't-15',
        status: 'submitted',
        title: 'Tree Obstruction Reported',
        description: 'Resident notified city of bike lane blockage.',
        timestamp: '2026-10-31T11:00:00.000Z'
      },
      {
        id: 't-16',
        status: 'in_progress',
        title: 'Emergency Chainsaw Crew Deployed',
        description: 'Parks team cleared roadway and fed brush into chipper.',
        timestamp: '2026-10-31T13:30:00.000Z',
        officerName: 'Nathan Cole',
        department: 'Parks & Urban Forestry'
      },
      {
        id: 't-17',
        status: 'resolved',
        title: 'Lane Swept & Reopened',
        description: 'Logs removed for mulching; street sweeper completed cleanup.',
        timestamp: '2026-10-31T15:20:00.000Z',
        officerName: 'Nathan Cole',
        department: 'Parks & Urban Forestry'
      }
    ],
    comments: [
      {
        id: 'c-7',
        authorName: 'Felix Dupont',
        authorRole: 'resident',
        text: 'Remarkably fast turnaround! Less than 5 hours from report to clear lane. Great work CivicTrack team.',
        createdAt: '2026-10-31T16:00:00.000Z'
      }
    ]
  },
  {
    id: 'CT-2026-8790',
    title: 'Broken Yield / Pedestrian Crossing Sign at School Gate',
    description: 'A delivery truck backed into the school pedestrian crossing sign post, bending it at a 45 degree angle and obscuring the warning reflector.',
    category: 'traffic_sign',
    status: 'submitted',
    severity: 'high',
    latitude: 40.7198,
    longitude: -74.0012,
    address: '310 College Crescent, Gate 2',
    landmark: 'Directly facing South University Primary Entrance',
    ward: 'Ward 27 - South University Enclave',
    imageUrl: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=1000&q=80',
    reporterName: 'Principal Margaret Lee',
    reporterContact: 'm.lee@edu.org',
    isAnonymous: false,
    createdAt: '2026-11-02T13:10:00.000Z',
    updatedAt: '2026-11-02T13:10:00.000Z',
    upvotes: 22,
    userHasUpvoted: false,
    assignedDepartment: 'Traffic & Public Safety',
    timeline: [
      {
        id: 't-18',
        status: 'submitted',
        title: 'Traffic Sign Complaint Logged',
        description: 'Submitted with school safety urgency flag.',
        timestamp: '2026-11-02T13:10:00.000Z'
      }
    ],
    comments: []
  },
  {
    id: 'CT-2026-8762',
    title: 'Continuous Fresh Water Pipeline Seepage near Hospital',
    description: 'Clear drinking water has been bubbling up from between concrete slabs outside the hospital emergency ambulance bay for 3 days.',
    category: 'water_leakage',
    status: 'submitted',
    severity: 'medium',
    latitude: 40.7160,
    longitude: -74.0050,
    address: '77 St. Michael Way, Ambulance Bay Ramp',
    landmark: 'Behind Emergency Trauma Wing',
    ward: 'Ward 12 - Downtown Metro',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1000&q=80',
    reporterName: 'Paramedic Dave Harris',
    reporterContact: 'd.harris@hospital.org',
    isAnonymous: false,
    createdAt: '2026-11-02T14:05:00.000Z',
    updatedAt: '2026-11-02T14:05:00.000Z',
    upvotes: 18,
    userHasUpvoted: false,
    assignedDepartment: 'Water Supply & Sewerage',
    timeline: [
      {
        id: 't-19',
        status: 'submitted',
        title: 'Hospital Zone Leak Submitted',
        description: 'Complaint entered into water board urgent queue.',
        timestamp: '2026-11-02T14:05:00.000Z'
      }
    ],
    comments: []
  }
];

export const INITIAL_NOTIFICATIONS: CivicNotification[] = [
  {
    id: 'notif-1',
    title: 'Work Underway on Grand Ave Drain',
    message: 'High-pressure vacuum crew #4 arrived at #CT-2026-8942.',
    type: 'status_change',
    complaintId: 'CT-2026-8942',
    createdAt: '2026-11-02T10:32:00.000Z',
    read: false
  },
  {
    id: 'notif-2',
    title: 'Issue Resolved: Greenway Streetlights',
    message: 'Faulty LED fixtures replaced and verified at #CT-2026-8850.',
    type: 'resolved',
    complaintId: 'CT-2026-8850',
    createdAt: '2026-11-01T20:31:00.000Z',
    read: true
  },
  {
    id: 'notif-3',
    title: 'High Community Attention',
    message: 'Your upvoted report on Hudson St Pothole reached 67 citizen votes!',
    type: 'upvote',
    complaintId: 'CT-2026-8935',
    createdAt: '2026-11-01T17:15:00.000Z',
    read: true
  }
];
