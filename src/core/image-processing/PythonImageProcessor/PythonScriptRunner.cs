using Python.Runtime;

namespace Cerberus.Core.PythonImageProcessor;

public class PythonScriptRunner
{
    public string Run(string script)
    {
        using (Py.GIL())
        {
            /*dynamic np = Py.Import("numpy");
            var radians = np.radians(45);
            var sin = np.sin(radians);
            return sin.ToString();*/
            var aux = PythonEngine.Eval(script);
            return aux.ToString();
        }
    }

    public bool CalculateSin(double degrees)
    {
        using (Py.GIL())
        {
            var script = @"
def calculate_sin(degrees):
    import numpy as np
    radians = np.radians(degrees)
    sinus = np.sin(radians)
    return True if sinus > 0 else False
";
            // PythonEngine.RunSimpleString(script);
            using (var scope = Py.CreateScope())
            {
                var scriptCompiled = PythonEngine.Compile(script);
                scope.Execute(scriptCompiled);
                var function = scope.Get("calculate_sin");
                var result = function.Invoke(new PyFloat(degrees));
                return result.As<bool>();
            }
        }
    }
}