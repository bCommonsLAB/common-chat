
interface BreadcrumbItem {
  label: string;
  href: string;
  onClick?: () => void;
}

interface BreadcrumbPathProps {
  items: BreadcrumbItem[];
}

const BreadcrumbPath: React.FC<BreadcrumbPathProps> = ({ items }) => {
  return (
    <nav>
      {items.map((item, index) => (
        <span key={item.href}>
          {index > 0 && " / "}
          <a 
            href={item.href}
            onClick={(e) => {
              if (item.onClick) {
                e.preventDefault();
                item.onClick();
              }
            }}
            className="hover:underline"
          >
            {item.label}
          </a>
        </span>
      ))}
    </nav>
  );
};

export default BreadcrumbPath; 