import { NextRequest, NextResponse } from 'next/server';
import { getDistrictBulletin } from '@/lib/bamis/fetchBulletin';
import { isValidDistrictId } from '@/data/districts';


export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ districtId: string }> }
) {
  try {
    const { districtId } = await context.params;
    const id = parseInt(districtId, 10);

    if (isNaN(id) || !isValidDistrictId(id)) {
      return NextResponse.json(
        {
          error: 'অকার্যকর জেলা আইডি (Invalid district ID). Please provide a valid Bangladesh district ID (1-66).'
        },
        { status: 400 }
      );
    }

    const bulletin = await getDistrictBulletin(id);

    return NextResponse.json(bulletin, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=10800, stale-while-revalidate=86400',
        'Content-Type': 'application/json'
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('[API BULLETIN ERROR]:', errorMessage);
    return NextResponse.json(
      {
        error: errorMessage || 'বুলেটিন তথ্য লোড করতে ব্যর্থ হয়েছে (Failed to fetch bulletin)'
      },
      { status: 502 }
    );
  }
}
