export const PageHeader = ({ title, subtitle, breadcrumb }) => {
  return (
    <div className="bg-primary pt-40 pb-16 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-teal/10 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
        {breadcrumb && (
          <p className="text-teal font-medium mb-4 tracking-wide uppercase text-sm">
            {breadcrumb}
          </p>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
          {title}
        </h1>
        {subtitle && (
          <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-300">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
