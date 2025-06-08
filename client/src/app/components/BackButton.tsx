import Link from "next/link";

export default function BackButton() {
  return (
    <Link href="/" className="text-gray-300 hover:text-white mb-4 block">← Back to Home</Link>
  );
}
