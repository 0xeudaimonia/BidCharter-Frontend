import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/src/libs/prisma';

export async function GET() {
  try {
    const bidInfo = await prisma.bidderInfo.findMany();
    return NextResponse.json(bidInfo, { status: 200 });
  } catch (error) {
    console.error('Error fetching bid info:', error);
    return NextResponse.json({ error: 'Error fetching bid info' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { auctionAddress, bidder, price } = await req.json();

  if (!auctionAddress || !bidder || !price) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  if(typeof auctionAddress !== 'string' || typeof bidder !== 'string' || typeof price !== 'string') {
    return NextResponse.json(
      { error: 'Invalid data types' },
      { status: 400 }
    );
  }

  try {

    const oldBidInfo = await prisma.bidderInfo.findUnique({
      where: {
        auctionAddress_bidder: {
          auctionAddress,
          bidder,
        },
      },
    });

    if (oldBidInfo) {
      return NextResponse.json(
        { error: 'Forbidden Double Bid' }, 
        { status: 400 }
      );
    }

    const bidInfo = await prisma.bidderInfo.create({
      data: {
        auctionAddress,
        bidder,
        price,
      },
    });

    return NextResponse.json(
      { message: 'Bid info created successfully', bidInfo },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating bid info:', error);
    return NextResponse.json(
      { error: 'Failed to create bid info' },
      { status: 500 }
    );
  }
}

// export async function PUT(req: NextRequest) {
//   // try {
//   //   const { id, title, description, points } = await req.json();
//   //   const updatedReward = await prisma.dailyReward.update({
//   //     where: { id },
//   //     data: { title, description, points }
//   //   });
//   //   return NextResponse.json(updatedReward, { status: 200 });
//   // } catch (error) {
//   //   return NextResponse.json({ error: 'Error updating reward' }, { status: 500 });
//   // }
// }

// export async function DELETE(req: NextRequest) {
//   // try {
//   //   const { id } = await req.json();
//   //   await prisma.dailyReward.delete({
//   //     where: { id }
//   //   });
//   //   return new NextResponse(null, { status: 204 });
//   // } catch (error) {
//   //   return NextResponse.json({ error: 'Error deleting reward' }, { status: 500 });
//   // }
// }