# Navigate back to your project root
cd ..

# Create the script file
echo '#!/bin/bash

# Create components structure
mkdir -p components/{ui,layout,features}
mkdir -p components/ui/{Button,Card,Input}
mkdir -p components/layout/{Header,Footer,Sidebar}
mkdir -p components/features/{cart,shop}

# Create basic component files
touch components/ui/Button/index.tsx components/ui/Button/Button.tsx
touch components/ui/Card/index.tsx components/ui/Card/Card.tsx
touch components/ui/Input/index.tsx components/ui/Input/Input.tsx

touch components/layout/Header/index.tsx components/layout/Header/Header.tsx
touch components/layout/Footer/index.tsx components/layout/Footer/Footer.tsx
touch components/layout/Sidebar/index.tsx components/layout/Sidebar/Sidebar.tsx

touch components/features/cart/{CartItem,CartSummary}.tsx
touch components/features/shop/{ProductCard,ProductGrid}.tsx

# Create lib structure
mkdir -p lib/{utils,hooks,api}
touch lib/utils/{format,validation}.ts
touch lib/hooks/{useCart,useAuth}.ts
touch lib/api/{products,orders}.ts

# Create types structure
mkdir -p types
touch types/{index,product,order,user}.ts

# Create styles structure
mkdir -p styles
touch styles/{globals,variables}.css

# Create config structure
mkdir -p config
touch config/{site,constants}.ts

# Create tests structure
mkdir -p tests/{components,utils}

echo "Full project structure created successfully!"' > create-full-structure.sh

# Make the script executable
chmod +x create-full-structure.sh

# Run the script from project root
bash create-full-structure.sh