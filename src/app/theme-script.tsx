export function ThemeScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            const getCookie = (name) => {
              const value = "; " + document.cookie;
              const parts = value.split("; " + name + "=");
              if (parts.length === 2) return parts.pop().split(";").shift();
              return null;
            };
            
            const theme = getCookie('theme') || 'light';
            const isDark = theme === 'dark';
            
            if (isDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
            
            // Store theme in a global variable for components to access
            window.__THEME__ = theme;
          })();
        `,
      }}
    />
  );
}