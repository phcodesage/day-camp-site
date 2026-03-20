import AfterschoolPrograms from './AfterschoolPrograms';
import { getCmsSectionContent } from '@/lib/cms/cms';

export default async function AfterschoolProgramsSection() {
  const cms = await getCmsSectionContent('afterschoolPrograms');
  return <AfterschoolPrograms cms={cms} />;
}

