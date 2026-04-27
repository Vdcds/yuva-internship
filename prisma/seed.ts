import { PrismaClient, RequestStatus, AppointmentStatus, Priority } from '@prisma/client'

const prisma = new PrismaClient()

const categoryPriority: Record<string, Priority> = {
  'Transport': 'HIGH',
  'Legal': 'HIGH',
  'Tax': 'MEDIUM',
  'Utilities': 'MEDIUM',
  'Documents': 'LOW',
  'Health': 'HIGH',
  'Education': 'MEDIUM',
  'Business': 'MEDIUM',
  'Land Records': 'MEDIUM',
  'Other': 'LOW',
}

const officers = [
  'Rajesh Kumar',
  'Sunita Patel',
  'Amit Sharma',
  'Preeti Singh',
  'Vijay Malhotra',
]

function getPriority(category: string): Priority {
  return categoryPriority[category] || 'MEDIUM'
}

function getRandomOfficer(): string {
  return officers[Math.floor(Math.random() * officers.length)]
}

async function main() {
  // Clean existing data
  await prisma.activityLog.deleteMany()
  await prisma.document.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.serviceRequest.deleteMany()
  await prisma.user.deleteMany()

  // Create Admin
  const admin = await prisma.user.create({
    data: {
      clerkId: 'admin_001',
      email: 'admin@egovernance.gov',
      name: 'Administrator',
      role: 'ADMIN',
    },
  })

  // Create Citizens
  const citizen1 = await prisma.user.create({
    data: {
      clerkId: 'citizen_001',
      email: 'rahul.sharma@gmail.com',
      name: 'Rahul Sharma',
      role: 'CITIZEN',
    },
  })

  const citizen2 = await prisma.user.create({
    data: {
      clerkId: 'citizen_002',
      email: 'priya.verma@yahoo.com',
      name: 'Priya Verma',
      role: 'CITIZEN',
    },
  })

  const citizen3 = await prisma.user.create({
    data: {
      clerkId: 'citizen_003',
      email: 'amit.kumar@outlook.com',
      name: 'Amit Kumar',
      role: 'CITIZEN',
    },
  })

  // Create Service Requests with priority and assigned officer
  const requests = [
    {
      title: 'Driving License Application',
      description: 'Apply for new driving license - Category DL',
      category: 'Transport',
      status: RequestStatus.PENDING,
      userId: citizen1.id,
      createdAt: new Date('2025-04-25'),
    },
    {
      title: 'Water Supply Connection Request',
      description: 'New water connection for residential property at Sector 15',
      category: 'Utilities',
      status: RequestStatus.APPROVED,
      remarks: 'Connection approved, installation scheduled',
      userId: citizen1.id,
      createdAt: new Date('2025-04-20'),
    },
    {
      title: 'Property Tax Payment FY 2025-26',
      description: 'Annual property tax payment for house #42, Green Avenue',
      category: 'Tax',
      status: RequestStatus.PENDING,
      userId: citizen2.id,
      createdAt: new Date('2025-04-26'),
    },
    {
      title: 'Marriage Certificate Application',
      description: 'Application for registered marriage certificate',
      category: 'Legal',
      status: RequestStatus.APPROVED,
      remarks: 'Certificate ready for pickup',
      userId: citizen2.id,
      createdAt: new Date('2025-04-15'),
    },
    {
      title: 'Vehicle Registration Renewal',
      description: 'Renew registration for Honda City (TN-01-AB-1234)',
      category: 'Transport',
      status: RequestStatus.REJECTED,
      remarks: 'Insurance documents required',
      userId: citizen3.id,
      createdAt: new Date('2025-04-18'),
    },
    {
      title: 'Electricity Bill Complaint',
      description: 'High billing discrepancy for March 2025',
      category: 'Utilities',
      status: RequestStatus.PENDING,
      userId: citizen3.id,
      createdAt: new Date('2025-04-27'),
    },
    {
      title: 'Building Plan Approval',
      description: 'Apply for building construction approval for commercial plot',
      category: 'Legal',
      status: RequestStatus.APPROVED,
      remarks: 'Plan approved with conditions',
      userId: citizen1.id,
      createdAt: new Date('2025-04-10'),
    },
    {
      title: 'Trade License Registration',
      description: 'New trade license for grocery store',
      category: 'Business',
      status: RequestStatus.PENDING,
      userId: citizen2.id,
      createdAt: new Date('2025-04-24'),
    },
    {
      title: 'Passport Application Status',
      description: 'Check status of passport application submitted in Feb 2025',
      category: 'Documents',
      status: RequestStatus.APPROVED,
      remarks: 'Passport dispatched',
      userId: citizen1.id,
      createdAt: new Date('2025-04-05'),
    },
    {
      title: 'Income Certificate Request',
      description: 'Apply for income certificate for scholarship application',
      category: 'Documents',
      status: RequestStatus.PENDING,
      userId: citizen3.id,
      createdAt: new Date('2025-04-28'),
    },
  ]

  for (const req of requests) {
    const created = await prisma.serviceRequest.create({
      data: {
        ...req,
        priority: getPriority(req.category),
        assignedTo: getRandomOfficer(),
      },
    })

    // Add activity log for creation
    await prisma.activityLog.create({
      data: {
        action: 'created',
        details: 'Request submitted',
        requestId: created.id,
      },
    })

    // Add activity for status changes (if not pending)
    if (req.status === RequestStatus.APPROVED) {
      await prisma.activityLog.create({
        data: {
          action: 'status_updated',
          details: `Status changed to ${req.status}`,
          requestId: created.id,
        },
      })
    } else if (req.status === RequestStatus.REJECTED) {
      await prisma.activityLog.create({
        data: {
          action: 'status_updated',
          details: `Status changed to ${req.status}`,
          requestId: created.id,
        },
      })
    }
  }

  // Create Appointments
  await prisma.appointment.createMany({
    data: [
      {
        department: 'Transport Office',
        date: new Date('2025-05-02'),
        timeSlot: '10:00 AM',
        status: AppointmentStatus.SCHEDULED,
        notes: 'Bring original ID proofs',
        userId: citizen1.id,
      },
      {
        department: 'Revenue Office',
        date: new Date('2025-05-05'),
        timeSlot: '02:00 PM',
        status: AppointmentStatus.SCHEDULED,
        notes: 'Property tax payment confirmation',
        userId: citizen2.id,
      },
      {
        department: 'Municipal Corporation',
        date: new Date('2025-05-08'),
        timeSlot: '11:00 AM',
        status: AppointmentStatus.SCHEDULED,
        notes: 'Building plan review meeting',
        userId: citizen1.id,
      },
      {
        department: 'Electricity Board',
        date: new Date('2025-04-30'),
        timeSlot: '09:00 AM',
        status: AppointmentStatus.COMPLETED,
        notes: 'Meter reading verification',
        userId: citizen3.id,
      },
      {
        department: 'Legal Services',
        date: new Date('2025-05-12'),
        timeSlot: '03:00 PM',
        status: AppointmentStatus.SCHEDULED,
        notes: 'Marriage certificate pickup',
        userId: citizen2.id,
      },
    ],
  })

  // Get requests for documents
  const allRequests = await prisma.serviceRequest.findMany({ take: 5 })

  // Create Documents
  await prisma.document.createMany({
    data: [
      {
        fileName: 'aadhaar_card.pdf',
        fileUrl: '/documents/aadhaar_card.pdf',
        fileType: 'PDF',
        requestId: allRequests[0].id,
        uploadedAt: new Date('2025-04-25'),
      },
      {
        fileName: 'tax_receipt_2024.pdf',
        fileUrl: '/documents/tax_receipt_2024.pdf',
        fileType: 'PDF',
        requestId: allRequests[2].id,
        uploadedAt: new Date('2025-04-20'),
      },
      {
        fileName: 'license_application_form.pdf',
        fileUrl: '/documents/license_application_form.pdf',
        fileType: 'PDF',
        requestId: allRequests[0].id,
        uploadedAt: new Date('2025-04-26'),
      },
      {
        fileName: 'property_document.pdf',
        fileUrl: '/documents/property_document.pdf',
        fileType: 'PDF',
        requestId: allRequests[1].id,
        uploadedAt: new Date('2025-04-18'),
      },
      {
        fileName: 'insurance_certificate.pdf',
        fileUrl: '/documents/insurance_certificate.pdf',
        fileType: 'PDF',
        requestId: allRequests[4].id,
        uploadedAt: new Date('2025-04-19'),
      },
    ],
  })

  console.log('✅ Enhanced seed data created!')
  console.log(`   - Users: 1 Admin, 3 Citizens`)
  console.log(`   - Requests: 10 with priority & activity logs`)
  console.log(`   - Appointments: 5`)
  console.log(`   - Documents: 5`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })