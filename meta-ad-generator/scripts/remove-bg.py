"""Remove background from product photos using rembg."""
import sys
import os
from pathlib import Path
from rembg import remove
from PIL import Image
import io

def process_image(input_path, output_path):
    """Remove background and save as PNG with transparency."""
    with open(input_path, 'rb') as f:
        input_data = f.read()

    output_data = remove(input_data)

    img = Image.open(io.BytesIO(output_data))
    img.save(output_path, 'PNG')

    size_mb = os.path.getsize(output_path) / (1024 * 1024)
    print(f"  OK: {Path(output_path).name} ({size_mb:.2f} MB)")

def main():
    if len(sys.argv) < 3:
        print("Usage: python remove-bg.py <input_dir> <output_dir> [file1,file2,...]")
        sys.exit(1)

    input_dir = Path(sys.argv[1])
    output_dir = Path(sys.argv[2])
    output_dir.mkdir(parents=True, exist_ok=True)

    # If specific files provided, use those; otherwise process all jpgs
    if len(sys.argv) > 3:
        files = sys.argv[3].split(',')
    else:
        files = [f.name for f in input_dir.glob('*.jpg')]

    print(f"Removing backgrounds from {len(files)} image(s)...\n")

    for filename in files:
        input_path = input_dir / filename
        if not input_path.exists():
            print(f"  SKIP: {filename} -- not found")
            continue

        output_name = Path(filename).stem + '-cutout.png'
        output_path = output_dir / output_name

        try:
            process_image(str(input_path), str(output_path))
        except Exception as e:
            print(f"  ERR: {filename} -- {e}")

    print(f"\nDone! Cutouts saved to: {output_dir}")

if __name__ == '__main__':
    main()
