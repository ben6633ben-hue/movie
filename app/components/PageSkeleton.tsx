import Navbar from "./Navbar";
import CategoryBar from "./CategoryBar";
import Footer from "./Footer";
import LoadingSpinner from "./LoadingSpinner";

export default function PageSkeleton({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <CategoryBar />
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center">
          <LoadingSpinner label={label} />
          <p className="text-gray-600 dark:text-gray-400 mt-4">{label}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
