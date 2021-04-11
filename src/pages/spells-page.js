import { Header } from '../components/common/header';
import { SpellsSearch } from '../components/spells/spells-search';

export function SpellsPage() {
  return (
    <div className="container">
      <Header title='Spells' />
      <SpellsSearch />
    </div>
  )
}
