from backend.db import get_engine, Base
from backend.models.review import Review 

print("Menghubungkan ke Database...")
engine = get_engine()

print("MENGHAPUS tabel lama (Drop All)...")
Base.metadata.drop_all(engine)

print("MEMBUAT tabel baru (Create All)...")
Base.metadata.create_all(engine)

print("Selesai! Database sudah sinkron dengan kodingan.")
